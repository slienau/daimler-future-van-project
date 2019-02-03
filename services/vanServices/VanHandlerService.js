const GoogleMapsHelper = require('../GoogleMapsHelper')
const Route = require('../../models/Route.js')
const _ = require('lodash')
const Logger = require('../WinstonLogger').logger

class VanHandlerService {
  static async confirmVan (fromVB, toVB, van, order, passengerCount) {
    const orderId = order._id
    const wholeRoute = await Route.findById(order.route)
    const vanRoute = wholeRoute.vanRoute
    const toVBRoute = van.potentialRoute
    van.potentialRoute = null

    // van already has a route
    if (van.nextRoutes.length > 0) {
      van.currentlyPooling = true
    }

    let timeToVB = GoogleMapsHelper.readDurationFromGoogleResponse(toVBRoute)
    if (!timeToVB && van.nextRoutes.length !== 0) {
      timeToVB = GoogleMapsHelper.readDurationFromGoogleResponse(van.nextRoutes[0])
      Logger.info('Took time from different route: ' + timeToVB)
    }
    Logger.info('Seconds to next VB: ' + timeToVB)
    van.nextStopTime = new Date(Date.now() + (timeToVB * 1000))

    // link the added next stops with the order they came from so that we can delete them if one cancels its order
    let fromStop = {
      vb: fromVB,
      orderId: orderId
    }
    let toStop = {
      vb: toVB,
      orderId: orderId
    }

    // insert the two new stops at the second last position of the next stops
    van.nextStops.splice(-1, 0, fromStop, toStop)

    if (van.potentialCutOffStep != null) {
      // cut off the current route from where the stepAhead begins
      van.nextRoutes[0].routes[0].legs[0].steps.splice(van.potentialCutOffStep + 1)
      van.potentialCutOffStep = null
    } else {
      // throw away the last route because thats the one thats changed
      van.nextRoutes.pop()
    }
    // add the new two routes
    van.nextRoutes.push(toVBRoute, vanRoute)

    // add the new passengers to the list of all passengers
    van.passengers.push({ orderId: orderId, passengerCount: passengerCount })

    if (van.currentStep === 0 && !van.lastStepTime) {
      van.lastStepTime = new Date()
    }

    Logger.info('##### CONFIRM #####')
    Logger.info(van.nextStops)
    Logger.info(van.nextRoutes)
    return van
  }

  static async startRide (van, orderId) {
    // if a passenger enters the van, remove the passengers start bus stop from the list of all next stops
    // if this list then contains no next stop that matches the current waiting stop, the van picked up all passengers and is ready to ride
    if (van.waiting) {
      let r = _.remove(van.nextStops, (nextStop) => {
        return nextStop.orderId.equals(orderId) && nextStop.vb._id.equals(van.waitingAt._id)
      })
      Logger.info('removed ' + r.length + ' stops')
      if (_.find(van.nextStops, (nextStop) => nextStop.vb._id.equals(van.waitingAt._id)) === undefined) {
        // van continues the ride
        van.currentStep = 0
        van.lastStepTime = new Date()
        van.waiting = false
        van.waitingAt = null
        const timeToVB = GoogleMapsHelper.readDurationFromGoogleResponse(van.nextRoutes[0])
        van.nextStopTime = new Date(Date.now() + (timeToVB * 1000))
        Logger.info('continue ride')
      }
      return true
    }
    return false
  }

  static async endRide (van, orderId) {
    // if a passenger leaves the van, remove the passengers end bus stop from the list of all next stops
    // if this list then contains no next stop anymore, all passengers have left the van and its again ready to ride
    if (van.waiting) {
      let r = _.remove(van.nextStops, nextStop => nextStop.orderId.equals(orderId))
      _.remove(van.passengers, p => p.orderId.equals(orderId))
      Logger.info('removed ' + r.length + ' stops')
      if (van.nextStops.length === 0) {
        this.resetVan(van)
        Logger.info('van reset')
      }
      return true
    }
    return false
  }

  static async cancelRide (van, orderId) {
    // if a passenger cancels its ride, remove all next stops of the passenger and the passengers
    // van.nextRoutes needs to be updated
    _.remove(van.nextStops, nextStop => nextStop.orderId.equals(orderId))
    _.remove(van.passengers, p => p.orderId.equals(orderId))
    const numberStops = _.uniqWith(van.nextStops, (val1, val2) => val1.vb._id.equals(val2.vb._id)).length
    if (van.nextStops.length === 0) {
      // if the list of next stops then is empty, the van has no order anymore and can be reset
      this.resetVan(van)
    } else if (numberStops === 1) {
      // first remove the two old/cancelled routes
      van.nextRoutes.pop()
      van.nextRoutes.pop()

      // now check if the route has a next route left or not
      let startLocation
      if (van.nextRoutes.length > 0) {
        // if so, set start location to the current routes next step
        let endLocation = van.nextRoutes[0].routes[0].legs[0].steps[van.currentStep].end_location
        startLocation = { latitude: endLocation.lat, longitude: endLocation.lng }
        // and remove the rest of the steps of the current route
        van.nextRoutes[0].routes[0].legs[0].steps.splice(van.currentStep + 1)
      } else {
        // if not calculate the route from the current van location
        startLocation = van.location
        van.currentStep = 0
        van.lastStepTime = new Date()
      }
      const endVB = van.nextStops[0].vb
      const newRoute = await GoogleMapsHelper.simpleGoogleRoute(startLocation, endVB.location)

      van.nextRoutes.push(newRoute)
    } else {
      // recalculate route bewteen the last two stops
      const startVB = _.nth(van.nextStops, -2).vb
      const endVB = _.nth(van.nextStops, -1).vb
      const newRoute = await GoogleMapsHelper.simpleGoogleRoute(startVB.location, endVB.location)
      // remove the two old/cancelled routes and add the new one
      van.nextRoutes.pop()
      van.nextRoutes.pop()
      van.nextRoutes.push(newRoute)
    }
    van.currentlyPooling = false
    Logger.info('Cancel')
    Logger.info(van.nextStops)
    Logger.info(van.nextRoutes)
  }

  static resetVan (van) {
    Logger.info('resetting van', van.vanId)
    van.lastStepTime = null
    van.nextStopTime = null
    van.nextStops = []
    van.potentialRoute = null
    van.potentialCutOffStep = null
    van.potentialRouteTime = null
    van.currentlyPooling = false
    van.currentStep = 0
    van.waiting = false
    van.waitingAt = null
    van.nextRoutes = []
    van.passengers = []
  }
}

module.exports = VanHandlerService
