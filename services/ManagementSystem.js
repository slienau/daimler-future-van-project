const GoogleMapsHelper = require('../services/GoogleMapsHelper.js')
const Route = require('../models/Route.js')
// const VirtualBusStop = require('../models/VirtualBusStop.js')
const _ = require('lodash')

class ManagementSystem {
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
      }

      // Test 2 van already has a route/order, but is not pooled yet and destination vb is equal
      if (!tmpVan.currentlyPooling && _.last(tmpVan.nextStops.id) === toVB.id) {
        // calculate duration of the new route
        const referenceWayPoint = toVB.location // TODO first, get the reference way point, because the van may be driving atm
        const toStartVBRoute = await GoogleMapsHelper.simpleGoogleRoute(referenceWayPoint, fromVB.location)
        const toEndVBRoute = await GoogleMapsHelper.simpleGoogleRoute(fromVB.location, toVB.location)
        const newDuration = GoogleMapsHelper.readDurationFromGoogleResponse(toStartVBRoute) + GoogleMapsHelper.readDurationFromGoogleResponse(toEndVBRoute)
        // compare duration of new route to duration of current route
        const threshold = 600 // in seconds
        const currentDuration = GoogleMapsHelper.readDurationFromGoogleResponse(tmpVan.route) // TODO should be get from order, because van could have a null route when its currently in waiting state
        if (newDuration - currentDuration > threshold) {
          // threshold exceeded, van cant be used
          continue
        }
        possibleVans.push({
          vanId: tmpVan.vanId,
          toStartVBRoute: toStartVBRoute,
          toStartVBDuration: GoogleMapsHelper.readDurationFromGoogleResponse(toStartVBRoute)
        })
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
      console.log('tmpVan', tmpVan)
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
    console.log('possibleVans', possibleVans)
    // now determine best from all possible vans (the one with the lowest duration)
    const bestVan = this.getBestVan(possibleVans)
    console.log('bestVan', bestVan)
    if (bestVan == null) {
      // TODO error, no van found!
    }
    // set potential route (and thus lock the van)
    // const vanId = bestVan.id
    // this.vans[vanId - 1].potentialRoute = bestVan.toStartVBRoute

    const vanId = Math.floor(Math.random() * this.numberOfVans) + 1

    // Route TO first Virtual Bus Stop is saved in potential route and set lastStepTime
    const route = await GoogleMapsHelper.simpleGoogleRoute(start, fromVB.location)
    this.vans[vanId - 1].potentialRoute = route
    this.vans[vanId - 1].lastStepTime = new Date()
    const timeToVB = GoogleMapsHelper.readDurationFromGoogleResponse(route)

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
    this.vans[vanId - 1].nextStops = _.unionBy([start, [fromVB, toVB], end], 'id')

    this.vans[vanId - 1].currentStep = 0
    this.vans[vanId - 1].lastStepTime = new Date()

    return this.vans[vanId - 1]
  }

  static async startRide (order) {
    const wholeRoute = Route.findById(order.route)
    const vanRoute = wholeRoute.vanRoute
    const vanId = order.vanId
    // const toVB = await VirtualBusStop.findById(order.vanEndVBS)

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
