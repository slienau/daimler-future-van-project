const GoogleMapsHelper = require('../GoogleMapsHelper')
// const Route = require('../../models/Route.js')
const _ = require('lodash')
const Logger = require('../WinstonLogger').logger

class VanHandlerService {
  static async confirmVan (fromVB, toVB, van, order, passengerCount) {
    const orderId = order._id
    const potentialRoutes = van.potentialRoute
    const potentialStops = van.potentialStops
    van.potentialRoute = []
    van.potentialStops = []

    // van already has a route
    if (van.nextRoutes.length > 0) {
      van.currentlyPooling = true
    }

    let timeToVB = GoogleMapsHelper.readDurationFromGoogleResponse(potentialRoutes[0])
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
    // Check in what order route sohuld be build
    if (potentialStops.length <= 2) {
      van.nextStops.splice(-1, 0, fromStop, toStop)
      // Check at what position the two stops have to be inserted in nextStops
    } else if (_.nth(potentialStops, -1).equals(_.nth(potentialStops, -2))) {
      // insert the two new stops at the second last position of the next stops
      van.nextStops.splice(-1, 0, fromStop, toStop)
    } else if (_.last(potentialStops).equals(_.last(van.nextStops).vb)) {
      van.nextStops.splice(-1, 0, fromStop, toStop)
    } else {
      van.nextStops.splice(-1, 0, fromStop)
      van.nextStops.push(toStop)
    }

    if (van.potentialCutOffStep != null) {
      // cut off the current route from where the stepAhead begins
      van.nextRoutes[0].routes[0].legs[0].steps.splice(van.potentialCutOffStep + 1)
      van.potentialCutOffStep = null
    } else {
      // throw away the last route because thats the one thats changed
      van.nextRoutes.pop()
    }
    // add the new two routes
    for (let index = 1; index < potentialRoutes.length; index++) {
      van.nextRoutes.push(potentialRoutes[index])
    }

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
  // TODO van weiterfahren lassen wenn nicht letzter stop
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
      // first remove all old/cancelled routes but the first one (which the van is currently driving)
      van.nextRoutes.splice(1)

      // now calculatae the routes two the next stops
      await this.recalculateRoutes(van, van.currentStep)

      van.nextStopTime = new Date(Date.now() + GoogleMapsHelper.readDurationFromGoogleResponse(van.nextRoutes[0]) * 1000)
    }
    van.currentlyPooling = false
    Logger.info('Cancel')
    Logger.info(van.nextStops)
    Logger.info(van.nextRoutes)
  }

  static async recalculateRoutes (van, cutOffStep) {
    let startLocation
    if (van.nextRoutes.length > 0) {
      // if next routes left, set start location to the given current routes cutOff step
      let endLocation = van.nextRoutes[0].routes[0].legs[0].steps[cutOffStep].end_location
      startLocation = { latitude: endLocation.lat, longitude: endLocation.lng }
      // and remove all steps after the cutOff step
      van.nextRoutes[0].routes[0].legs[0].steps.splice(cutOffStep + 1)
    } else {
      // if not calculate the route from the current van location
      startLocation = van.location
      van.currentStep = 0
      van.lastStepTime = new Date()
    }
    let nextVBs = _.uniqWith(van.nextStops, (val1, val2) => val1.vb._id.equals(val2.vb._id)).map(stop => stop.vb)
    for (let vb of nextVBs) {
      const route = await GoogleMapsHelper.simpleGoogleRoute(startLocation, vb.location)
      van.nextRoutes.push(route)
      startLocation = vb.location
    }
  }

  static resetVan (van) {
    Logger.info('resetting van', van.vanId)
    van.lastStepTime = null
    van.nextStopTime = null
    van.nextStops = []
    van.potentialRoute = []
    van.potentialCutOffStep = null
    van.potentialRouteTime = null
    van.potentialStops = []
    van.currentlyPooling = false
    van.currentStep = 0
    van.waiting = false
    van.waitingAt = null
    van.nextRoutes = []
    van.passengers = []
  }
}

module.exports = VanHandlerService
