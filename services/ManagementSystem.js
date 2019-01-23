const GoogleMapsHelper = require('../services/GoogleMapsHelper.js')
const Route = require('../models/Route.js')
// const VirtualBusStop = require('../models/VirtualBusStop.js')
const _ = require('lodash')

class ManagementSystem {
  /*
      gets the next step (waypoint) on the route of the van that is at least 120 seconds ahead or or the next way point and the duration
      it takes to get there
      TODO what if the van is currently waiting
      TODO what if the van has reached its destination (nextStops will be empty and route too)
      we distuingish to cases:
      (1) if the van has more than one next stops than this means the van is currently on its way
          to catch some passenger up; we dont want that passengers have to wait longer (could be cold :O), so in this case
          we take the second last step as the reference way point
      (2) the van has only one next stop left, meaning that its directly riding to the destionation, so in this case we can just
          take the step that is at least secondsAhead seconds ahead on the route
    */
  static getReferenceWaypointAndDuration (vanId, secondsAhead = 120) {
    let van = this.vans[vanId - 1]
    const currentTime = new Date()
    if (van.nextStops.length > 1) {
      // case (1)
      return [_.nth(van.nextStops, -2).location, (van.nextStopTime - currentTime) / 1000]
    } else if (van.nextStops.length === 1 && van.route) {
      // case (2)
      let steps = van.route.routes[0].legs[0].steps
      let seconds = 0
      for (let step = van.currentStep; step < steps.length; steps++) {
        seconds += steps[step].duration.value
        if (seconds >= secondsAhead) {
          return [steps[step].end_location, seconds] // equal to steps[step+1].start_location
        }
      }
    } else if (van.waiting) {
      // TODO
    }
  }

  static async getPossibleVans (fromVB, toVB) {
    const possibleVans = []
    for (let counter = 0; counter < this.numberOfVans; counter++) {
      const tmpVan = this.vans[counter]
      // Test 1 Gibt es potentialRoute --> dann gesperrt, wenn nicht eigene Route
      if (tmpVan.potentialRoute != null) {
        continue
      }

      // test 2 van is not driving at all and ready to take the route
      if (tmpVan.route == null && !tmpVan.waiting) {
        // calculate duration how long the van would need to the start vb
        const toStartVBRoute = await GoogleMapsHelper.simpleGoogleRoute(tmpVan.location, fromVB.location)
        possibleVans.push({
          vanId: tmpVan.vanId,
          toStartVBRoute: toStartVBRoute,
          toStartVBDuration: GoogleMapsHelper.readDurationFromGoogleResponse(toStartVBRoute)
        })
        continue
      }

      // Test 2 van already has a route/order, but is not pooled yet and destination vb is equal
      if (!tmpVan.currentlyPooling && _.last(tmpVan.nextStops).equals(toVB)) {
        // calculate duration of the new route
        const [referenceWayPoint, referenceWayPointDuration] = this.getReferenceWaypointAndDuration(tmpVan.vanId) // first, get the reference way point, because the van may be driving atm
        const toStartVBRoute = await GoogleMapsHelper.simpleGoogleRoute(referenceWayPoint, fromVB.location)
        const toEndVBRoute = await GoogleMapsHelper.simpleGoogleRoute(fromVB.location, toVB.location)
        let toStartVBDuration = GoogleMapsHelper.readDurationFromGoogleResponse(toStartVBRoute)
        toStartVBDuration += referenceWayPointDuration // add duration of how long the van needs to the reference way point
        const newDuration = toStartVBDuration + GoogleMapsHelper.readDurationFromGoogleResponse(toEndVBRoute)

        // compare duration of new route to duration of current route
        const threshold = 1200 // in seconds
        const currentDuration = GoogleMapsHelper.readDurationFromGoogleResponse(tmpVan.route) // TODO should be get from order
        if (newDuration - currentDuration > threshold) {
          // threshold exceeded, van cant be used
          continue
        }
        possibleVans.push({
          vanId: tmpVan.vanId,
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
  static async confirmVan (fromVB, toVB, vanId, passengerCount = 1) {
    this.vans[vanId - 1].route = this.vans[vanId - 1].potentialRoute
    this.vans[vanId - 1].potentialRoute = null

    const timeToVB = GoogleMapsHelper.readDurationFromGoogleResponse(this.vans[vanId - 1].route)

    this.vans[vanId - 1].nextStopTime = new Date(Date.now() + (timeToVB * 1000))

    let nextStops = this.vans[vanId - 1].nextStops
    let start = _.slice(nextStops, 0, -1)
    let end = _.slice(nextStops, -1)
    this.vans[vanId - 1].nextStops = _.unionBy(start, [fromVB, toVB], end, '_id')

    this.vans[vanId - 1].currentStep = 0
    this.vans[vanId - 1].lastStepTime = new Date()

    return this.vans[vanId - 1]
  }

  static async startRide (order) {
    const wholeRoute = Route.findById(order.route)
    const vanRoute = wholeRoute.vanRoute
    const vanId = order.vanId
    // const toVB = await VirtualBusStop.findById(order.virtualBusStopEnd)

    this.vans[vanId - 1].route = vanRoute

    const timeToVB = GoogleMapsHelper.readDurationFromGoogleResponse(this.vans[vanId - 1].route)

    this.vans[vanId - 1].nextStopTime = new Date(Date.now() + (timeToVB * 1000))
    // this.vans[vanId - 1].nextStops.push(toVB)
    this.vans[vanId - 1].currentStep = 0
    this.vans[vanId - 1].lastStepTime = new Date()
    this.vans[vanId - 1].waiting = false
  }

  static async endRide (order) {
    const vanId = order.vanId
    this.resetVan(vanId)
  }

  static async cancelRide (order) {
    const vanId = order.vanId
    this.resetVan(vanId)
  }

  static initializeVans () {
    for (let i = 0; i < this.numberOfVans; i++) {
      this.vans[i] = {
        vanId: i + 1,
        location: {
          latitude: 52.5150 + Math.random() * 3 / 100,
          longitude: 13.3900 + Math.random() * 3 / 100
        },
        route: null,
        lastStepTime: null,
        nextStopTime: null,
        nextStops: [],
        potentialRoute: null,
        currentlyPooling: false,
        currentStep: 0,
        waiting: false
      }
    }
  }

  static resetVan (vanId) {
    this.vans[vanId - 1].route = null
    this.vans[vanId - 1].lastStepTime = new Date()
    this.vans[vanId - 1].nextStopTime = null
    this.vans[vanId - 1].nextStops = []
    this.vans[vanId - 1].potentialRoute = null
    this.vans[vanId - 1].currentlyPooling = false
    this.vans[vanId - 1].currentStep = 0
    this.vans[vanId - 1].waiting = false
  }

  static updateVanLocations () {
    const currentTime = new Date()

    ManagementSystem.vans.forEach((van) => {
      // If van does not have a route or is waiting, check if it has a potential route that is older than 60s. if yes delete.
      if (!van.route) {
        if (van.potentialRoute && van.lastStepTime.getTime() + 60 * 1000 < currentTime.getTime()) {
          van.potentialRoute = null
          van.lastStepTime = null
        }
        return
      }
      if (van.waiting) return

      // This happens if van has aroute and has not reached the next bus Stop yet
      if (currentTime < van.nextStopTime) {
        // timePassed is the the time that has passed since the lastStepTime
        const timePassed = ((currentTime.getTime() - van.lastStepTime.getTime()) / 1000)
        let timeCounter = 0

        // Iterate through all steps ahead of current step & find the one that matches the time that has passed
        for (let step = van.currentStep; step < van.route.routes[0].legs[0].steps.length; step++) {
          timeCounter += van.route.routes[0].legs[0].steps[step].duration.value

          if (timeCounter > timePassed) {
            van.location = {
              latitude: van.route.routes[0].legs[0].steps[step].start_location.lat,
              longitude: van.route.routes[0].legs[0].steps[step].start_location.lng
            }
            // if algorithm has advanced a step, save the current time as the time of the last step
            if (step > van.currentStep) {
              van.lastStepTime = new Date(van.lastStepTime.getTime() + van.route.routes[0].legs[0].steps[step - 1].duration.value * 1000)
            }
            van.currentStep = step
            break
          }
        }
      // This happens if van has reached the next virtual bus stop
      } else {
        van.route = null
        van.currentStep = 0
        van.location = {
          latitude: van.route.routes[0].legs[0].end_location.lat,
          longitude: van.route.routes[0].legs[0].end_location.lng
        }
        van.lastStepTime = currentTime
        van.nextStops.shift()
        van.waiting = true
      }
    })
  }
}

ManagementSystem.vans = []
ManagementSystem.numberOfVans = 3
module.exports = ManagementSystem
