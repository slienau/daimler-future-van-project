const GoogleMapsHelper = require('../services/GoogleMapsHelper.js')
const Route = require('../models/Route.js')
// const VirtualBusStop = require('../models/VirtualBusStop.js')
const _ = require('lodash')

class ManagementSystem {
  /*
      gets the next step (waypoint) on the route of the van that is at least 120 seconds ahead or the next way point and the duration
      it takes to get there
      TODO what if the van is currently waiting -> currently not allowed
      TODO what if the van has reached its destination (nextStops will be empty and route too) -> should not happen
      if the van has only one next bus stop left, its meaning that the van is directly riding to the destionation, so in this case we can just
      take the step that is at least secondsAhead seconds ahead on the route
    */
  static getStepAheadOnCurrentRoute (vanId, secondsAhead = 120) {
    let van = this.vans[vanId - 1]
    if (van.nextRoutes > 0) {
      let steps = van.nextRoutes[0].routes[0].legs[0].steps
      let seconds = 0
      for (let step = van.currentStep; step < steps.length; steps++) {
        seconds += steps[step].duration.value
        if (seconds >= secondsAhead) {
          return [steps[step].end_location, seconds] // equal to steps[step+1].start_location
        }
      }
    }
  }

  static getRemainingRouteDuration (van) {
    let duration = 0
    if (van.nextRoutes.length > 0) {
      // add remaining duration of current route
      duration += GoogleMapsHelper.readDurationFromGoogleResponseFromStep(van.nextRoutes[0], van.currentStep)
      // add duration of all future routes
      duration += van.nextRoutes.slice(1).reduce((acc, route) => acc + GoogleMapsHelper.readDurationFromGoogleResponse(route), 0)
    }
    return duration
  }

  static async getPossibleVans (fromVB, toVB) {
    const possibleVans = []
    for (let counter = 0; counter < this.numberOfVans; counter++) {
      const van = this.vans[counter]
      // Test 1 Gibt es potentialRoute --> dann gesperrt, wenn nicht eigene Route
      if (van.potentialRoute != null) {
        continue
      }

      // test 2 van is not driving at all and ready to take the route
      if (van.nextRoutes.length === 0 && !van.waiting) {
        // calculate duration how long the van would need to the start vb
        const toStartVBRoute = await GoogleMapsHelper.simpleGoogleRoute(van.location, fromVB.location)
        possibleVans.push({
          vanId: van.vanId,
          toStartVBRoute: toStartVBRoute,
          toStartVBDuration: GoogleMapsHelper.readDurationFromGoogleResponse(toStartVBRoute)
        })
        continue
      }

      // Test 2 van already has a route/order, but is not pooled yet and destination vb is equal
      // currently only allow pooling for vans that are not waiting
      if (!van.currentlyPooling && _.last(van.nextStops).vb.equals(toVB) && !van.waiting) {
        let referenceWayPoint, referenceWayPointDuration
        if (van.nextStops.length === 1) {
          // first, get the reference way point, because the van may be driving atm
          [referenceWayPoint, referenceWayPointDuration] = this.getStepAheadOnCurrentRoute(van.vanId)
        } else if (van.nextStops.length > 1) {
          referenceWayPoint = _.nth(van.nextStops, -2).vb.location
          referenceWayPointDuration = this.getRemainingRouteDuration(van) - GoogleMapsHelper.readDurationFromGoogleResponse(_.last(van.nextRoutes)) // TODO
        }

        // calculate duration of the new route
        const toStartVBRoute = await GoogleMapsHelper.simpleGoogleRoute(referenceWayPoint, fromVB.location)
        const toEndVBRoute = await GoogleMapsHelper.simpleGoogleRoute(fromVB.location, toVB.location)
        let toStartVBDuration = GoogleMapsHelper.readDurationFromGoogleResponse(toStartVBRoute)
        toStartVBDuration += referenceWayPointDuration // add duration of how long the van needs to the reference way point
        const toEndVBDuration = GoogleMapsHelper.readDurationFromGoogleResponse(toEndVBRoute)
        const newDuration = toStartVBDuration + toEndVBDuration

        // compare duration of new route to duration of current route
        const threshold = 1200 // in seconds
        const currentDuration = this.getRemainingRouteDuration(van)
        console.log(currentDuration, newDuration)
        if (newDuration - currentDuration > threshold) {
          // threshold exceeded, van cant be used
          continue
        }
        possibleVans.push({
          vanId: van.vanId,
          toStartVBRoute: toStartVBRoute,
          toStartVBDuration: toStartVBDuration
        })
        continue
      }

      // Test 3 startVB oder destVB gleich
    }
    return _.sortBy(possibleVans, ['toStartVBDuration'])
  }

  static getBestVan (possibleVans) {
    while (possibleVans.length > 0) {
      // get next best van
      const tmpVan = possibleVans.shift()
      // make sure the van is still available
      if (this.vans[tmpVan.vanId - 1].potentialRoute == null) {
        return tmpVan
      }
    }
    return null // no van found
  }

  // Returns the van that will execute the ride
  static async requestVan (start, fromVB, toVB, destination, time = new Date(), passengerCount = 1) {
    this.updateVanLocations()

    // get all possible vans for this order request, sorted ascending by their duration
    const possibleVans = await this.getPossibleVans(fromVB, toVB, destination, time)
    console.log('possibleVans', possibleVans.map(v => [v.vanId, v.toStartVBDuration]))
    // now determine best from all possible vans (the one with the lowest duration)
    const bestVan = this.getBestVan(possibleVans)
    console.log('bestVan', bestVan.vanId)
    if (bestVan == null) {
      // TODO error, no van found!
      return null
    }
    // set potential route (and thus lock the van)
    const vanId = bestVan.vanId
    this.vans[vanId - 1].potentialRoute = bestVan.toStartVBRoute

    // const vanId = Math.floor(Math.random() * this.numberOfVans) + 1

    // Route TO first Virtual Bus Stop is saved in potential route and set lastStepTime
    // const route = await GoogleMapsHelper.simpleGoogleRoute(start, fromVB.location)
    // this.vans[vanId - 1].potentialRoute = route
    this.vans[vanId - 1].lastStepTime = new Date()
    // const timeToVB = GoogleMapsHelper.readDurationFromGoogleResponse(route)
    const timeToVB = bestVan.toStartVBDuration

    return { vanId: vanId, nextStopTime: new Date(Date.now() + (timeToVB * 1000)) }
  }

  // This is called when the users confirms/ places an order
  static async confirmVan (fromVB, toVB, vanId, order, passengerCount = 1) {
    const orderId = order._id
    const van = this.vans[vanId - 1]
    const wholeRoute = await Route.findById(order.route)
    const vanRoute = wholeRoute.vanRoute
    const toVBRoute = van.potentialRoute
    van.potentialRoute = null

    const timeToVB = GoogleMapsHelper.readDurationFromGoogleResponse(toVBRoute)
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

    // now add the new routes to the next routes and throw away the last route because thats the one thats changed
    van.nextRoutes.pop()
    van.nextRoutes.push(toVBRoute, vanRoute)

    if (van.currentStep === 0 && !van.lastStepTime) {
      van.lastStepTime = new Date()
    }

    console.log('##### CONFIRM #####')
    console.log('### NEXT STOPS ###')
    console.log(van.nextStops)
    console.log('### NEXT ROUTES ###')
    console.log(van.nextRoutes)
    console.log('### VAN ###')
    console.log(van)

    return van
  }

  static async startRide (order) {
    const vanId = order.vanId
    const van = this.vans[vanId - 1]
    console.log('### START RIDE ###')
    // if a passenger enters the van, remove the passengers start bus stop from the list of all next stops
    // if this list then contains no next stop that matches the current waiting stop, the van picked up all passengers and is ready to ride
    if (van.waiting) {
      let r = _.remove(van.nextStops, (nextStop) => {
        return nextStop.orderId.equals(order._id) && nextStop.vb._id.equals(van.waitingAt._id)
      })
      console.log('removed', r.length, 'stops')
      if (_.find(van.nextStops, (nextStop) => nextStop.vb._id.equals(van.waitingAt._id)) === undefined) {
        // van continues the ride
        van.currentStep = 0
        van.lastStepTime = new Date()
        van.waiting = false
        van.waitingAt = null
        const timeToVB = GoogleMapsHelper.readDurationFromGoogleResponse(van.nextRoutes[0])
        van.nextStopTime = new Date(Date.now() + (timeToVB * 1000))
        console.log('continue ride')
      }
      return true
    }
    return false
  }

  static async endRide (order) {
    const vanId = order.vanId
    const van = this.vans[vanId - 1]
    console.log('### END RIDE ###')
    // if a passenger leaves the van, remove the passengers end bus stop from the list of all next stops
    // if this list then contains no next stop anymore, all passengers have left the van and its again ready to ride
    if (van.waiting) {
      let r = _.remove(van.nextStops, nextStop => nextStop.orderId.equals(order._id))
      console.log('removed', r.length, 'stops')
      if (van.nextStops.length === 0) {
        this.resetVan(vanId)
        console.log('van reset')
      }
      return true
    }
    return false
  }

  static async cancelRide (order) {
    const vanId = order.vanId
    const van = this.vans[vanId - 1]

    // if a passenger cancels its ride, remove all next stops of the passenger
    // TODO van.nextRoutes needs to be updated (i guess)
    console.log('numberStops', _.uniqWith(van.nextStops, (val1, val2) => val1.vb._id.equals(val2.vb._id)).length)
    _.remove(van.nextStops, nextStop => nextStop.orderId.equals(order._id))
    const numberStops = _.uniqWith(van.nextStops, (val1, val2) => val1.vb._id.equals(val2.vb._id)).length
    if (van.nextStops.length === 0) {
      // if the list of next stops then is empty, the van has no order anymore and can be reset
      this.resetVan(vanId)
    } else if (numberStops === 1) {
      // TODO something with steps ahead?
      const startLocation = van.location
      const endVB = van.nextStops[0].vb
      const newRoute = await GoogleMapsHelper.simpleGoogleRoute(startLocation, endVB.location)
      // remove the two old/cancelled routes and add the new one
      van.nextRoutes.pop()
      van.nextRoutes.pop()
      van.nextRoutes.push(newRoute)
      van.currentStep = 0
      van.lastStepTime = new Date()
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
    console.log('##### CANCEL #####')
    console.log('numberStops', numberStops)
    console.log('### NEXT STOPS ###')
    console.log(van.nextStops)
    console.log('### NEXT ROUTES ###')
    console.log(van.nextRoutes)
    console.log('### VAN ###')
    console.log(van)
  }

  static initializeVans () {
    for (let i = 0; i < this.numberOfVans; i++) {
      this.vans[i] = {
        vanId: i + 1,
        location: {
          latitude: 52.5150 + Math.random() * 3 / 100,
          longitude: 13.3900 + Math.random() * 3 / 100
        },
        lastStepTime: null,
        nextStopTime: null,
        nextStops: [],
        nextRoutes: [],
        potentialRoute: null,
        currentlyPooling: false,
        currentStep: 0,
        waiting: false,
        waitingAt: null
      }
    }
  }

  static resetVan (vanId) {
    this.vans[vanId - 1].lastStepTime = new Date()
    this.vans[vanId - 1].nextStopTime = null
    this.vans[vanId - 1].nextStops = []
    this.vans[vanId - 1].potentialRoute = null
    this.vans[vanId - 1].currentlyPooling = false
    this.vans[vanId - 1].currentStep = 0
    this.vans[vanId - 1].waiting = false
    this.vans[vanId - 1].waitingAt = null
    this.vans[vanId - 1].nextRoutes = []
  }

  static updateVanLocations () {
    const currentTime = new Date()

    ManagementSystem.vans.forEach((van) => {
      // If van does not have a route or is waiting, check if it has a potential route that is older than 60s. if yes delete.
      if (van.nextRoutes.length === 0) {
        if (van.potentialRoute && van.lastStepTime.getTime() + 60 * 1000 < currentTime.getTime()) {
          van.potentialRoute = null
          van.lastStepTime = null
        }
        return
      }
      if (van.waiting) return

      // This happens if van has aroute and has not reached the next bus Stop yet
      const currentRoute = van.nextRoutes[0]
      const steps = currentRoute.routes[0].legs[0].steps
      console.log('##### UPDATE LOCATIONS #####')
      console.log('next stops:', van.nextStops.length)
      console.log('number steps:', steps.length)
      console.log('currentStep:', van.currentStep)
      console.log('van location:', van.location)
      if (van.location.latitude !== currentRoute.routes[0].legs[0].end_location.lat && van.location.longitude !== currentRoute.routes[0].legs[0].end_location.lng) {
        // timePassed is the the time that has passed since the lastStepTime
        const timePassed = ((currentTime.getTime() - van.lastStepTime.getTime()) / 1000)
        let timeCounter = 0
        console.log('time passed:', timePassed)
        console.log('curren step duration:', steps[van.currentStep].duration.value)

        // Iterate through all steps ahead of current step & find the one that matches the time that has passed
        for (let step = van.currentStep; step < steps.length; step++) {
          timeCounter += steps[step].duration.value

          if (timeCounter > timePassed) {
            van.location = {
              latitude: steps[step].start_location.lat,
              longitude: steps[step].start_location.lng
            }
            // if algorithm has advanced a step, save the current time as the time of the last step
            if (step > van.currentStep) {
              van.lastStepTime = new Date(van.lastStepTime.getTime() + steps[step - 1].duration.value * 1000)
            }
            van.currentStep = step
            break
          } else if (van.currentStep === steps.length - 1) {
            // van reached last step TODO
            console.log('last step reached')
            van.location = {
              latitude: steps[van.currentStep].end_location.lat,
              longitude: steps[van.currentStep].end_location.lng
            }
            // if algorithm has advanced a step, save the current time as the time of the last step
            van.lastStepTime = currentTime
            van.currentStep = 0
            van.waiting = true
            van.waitingAt = van.nextStops[0].vb
            // remove the current driven route (and all succeeding ones with a duration of zero)
            van.nextRoutes.shift()
            van.nextRoutes = _.dropWhile(van.nextRoutes, nextRoute => nextRoute.routes[0].legs[0].duration.value === 0)
            console.log('really waiting')
          }
        }
      // This happens if van has reached the next virtual bus stop
      } else {
        // van.route = null --> van.nextRoutes.shift() ? or shifting in startRide?
        console.log('waiting')
        van.currentStep = 0
        van.location = {
          latitude: currentRoute.routes[0].legs[0].end_location.lat,
          longitude: currentRoute.routes[0].legs[0].end_location.lng
        }
        van.lastStepTime = currentTime

        van.waiting = true
        van.waitingAt = van.nextStops[0].vb
      }
    })
  }
}

ManagementSystem.vans = []
ManagementSystem.numberOfVans = 3
module.exports = ManagementSystem
