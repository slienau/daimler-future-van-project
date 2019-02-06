const GoogleMapsHelper = require('../GoogleMapsHelper')
const _ = require('lodash')
const Logger = require('../WinstonLogger').logger
const Order = require('../../models/Order')
const Route = require('../../models/Route')

class VanRequestService {
  /*
      gets the next step (waypoint) on the route of the van that is at least 120 seconds ahead or the next way point and the duration
      it takes to get there
      if the van has only one next bus stop left, its meaning that the van is directly riding to the destionation, so in this case we can just
      take the step that is at least secondsAhead seconds ahead on the route
    */
  static getStepAheadOnCurrentRoute (van, secondsAhead = 120) {
    let currentTime = new Date()
    if (van.nextRoutes.length > 0) {
      let steps = van.nextRoutes[0].routes[0].legs[0].steps
      let seconds = (van.lastStepTime - currentTime) / 1000
      for (let step = van.currentStep; step < steps.length; step++) {
        seconds += steps[step].duration.value
        if (seconds >= secondsAhead) {
          let location = {
            latitude: steps[step].end_location.lat,
            longitude: steps[step].end_location.lng
          }
          return [location, seconds, step] // equal to steps[step+1].start_location
        }
      }
    }
    return []
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

  static async getPossibleVans (fromVB, toVB, walkingTimeToStartVB, passengerCount, vans) {
    const possibleVans = []
    const currentTime = new Date()

    for (let van of vans) {
      // Gibt es potentialRoute --> dann gesperrt, wenn nicht eigene Route
      if (van.potentialRoute.length !== 0) {
        continue
      }

      if (van.currentlyPooling || van.waiting) continue

      // check if the van has enough seats left
      const currentPassengerCount = van.passengers.reduce((prev, curr) => prev + curr.passengerCount, 0)
      if (currentPassengerCount + passengerCount > van.numberSeats) continue

      // Case: van is not driving at all and ready to take the route
      if (van.nextRoutes.length === 0) {
        // calculate duration how long the van would need to the start vb
        const toStartVBRoute = await GoogleMapsHelper.simpleGoogleRoute(van.location, fromVB.location)
        const toDestVBRoute = await GoogleMapsHelper.simpleGoogleRoute(fromVB.location, toVB.location)

        const toStartVBRouteDur = GoogleMapsHelper.readDurationFromGoogleResponse(toStartVBRoute)
        const toDestVBRouteDur = GoogleMapsHelper.readDurationFromGoogleResponse(toDestVBRoute)

        const secondsToRideStart = toStartVBRouteDur > walkingTimeToStartVB ? toStartVBRouteDur : walkingTimeToStartVB

        possibleVans.push({
          vanId: van.vanId,
          potentialNewRoute: [toStartVBRoute, toDestVBRoute],
          userVanRoute: [toDestVBRoute],
          potentialStops: [fromVB, toVB],
          rideStartTime: new Date(currentTime.getTime() + secondsToRideStart * 1000 + 30 * 1000),
          userArrivalAtDestVBS: new Date(currentTime.getTime() + secondsToRideStart * 1000 + 30 * 1000 + toDestVBRouteDur * 1000),
          toStartVBRoute: toStartVBRoute,
          toStartVBDuration: toStartVBRouteDur
        })
        continue
      }

      // now checking potential pooling

      const otherPasOrder = await Order.findById(van.nextStops[0].orderId)
      const otherPasRoute = await Route.findById(otherPasOrder.route)
      const threshold = 570 // in seconds, 10mins minus 30s for hopping on

      // Test 2 van already has a route/order, but is not pooled yet and destination vb is equal
      // currently only allow pooling for vans that are not waiting
      if (_.last(van.nextStops).vb.equals(toVB)) {
        let referenceWayPoint, referenceWayPointDuration, potentialCutOffStep

        if (van.nextStops.length === 1) {
        // first, get the reference way point, because the van may be driving atm
          [referenceWayPoint, referenceWayPointDuration, potentialCutOffStep] = this.getStepAheadOnCurrentRoute(van)
        } else if (van.nextStops.length > 1) {
          referenceWayPoint = _.nth(van.nextStops, -2).vb.location
          const orderId = _.nth(van.nextStops, -2).orderId
          // get route from orderId
          const order = await Order.findById(orderId)
          const route = await Route.findById(order.route).lean()
          referenceWayPointDuration = (route.vanETAatStartVBS - currentTime) / 1000
          // referenceWayPointDuration = this.getRemainingRouteDuration(van) - GoogleMapsHelper.readDurationFromGoogleResponse(_.last(van.nextRoutes)) // TODO
        }
        if (!referenceWayPoint || !referenceWayPointDuration) continue
        Logger.info('referenceWayPoint: ' + referenceWayPoint)
        Logger.info('referenceWayPointDuration: ' + referenceWayPointDuration)
        Logger.info('potentialCutOffStep: ' + potentialCutOffStep)

        // calculate duration of the new route
        const toStartVBRoute = await GoogleMapsHelper.simpleGoogleRoute(referenceWayPoint, fromVB.location)
        const toEndVBRoute = await GoogleMapsHelper.simpleGoogleRoute(fromVB.location, toVB.location)
        let toStartVBDuration = GoogleMapsHelper.readDurationFromGoogleResponse(toStartVBRoute)
        toStartVBDuration += referenceWayPointDuration // add duration of how long the van needs to the reference way point
        const toEndVBDuration = GoogleMapsHelper.readDurationFromGoogleResponse(toEndVBRoute)
        const newDuration = toStartVBDuration + toEndVBDuration

        // check passenger walking time against timeToStartVB
        if (walkingTimeToStartVB - toStartVBDuration > threshold) {
          continue
        }

        // compare duration of new route to duration of current route
        const currentDuration = this.getRemainingRouteDuration(van)
        Logger.info(currentDuration, newDuration)
        if (newDuration - currentDuration > threshold) {
          // threshold exceeded, van cant be used
          continue
        }
        const newRoutes = van.nextStops.length === 1 ? [toStartVBRoute, toEndVBRoute] : [van.nextRoutes[0], toStartVBRoute, toEndVBRoute]
        const secondsToRideStart = toStartVBDuration > walkingTimeToStartVB ? toStartVBDuration : walkingTimeToStartVB
        const potentialStops = van.nextStops.length === 1 ? [fromVB, toVB, toVB] : [van.nextStops[0].vb, fromVB, toVB, toVB]

        possibleVans.push({
          vanId: van.vanId,
          potentialNewRoute: newRoutes,
          toStartVBRoute: toStartVBRoute,
          userVanRoute: [toEndVBRoute],
          potentialStops: potentialStops,
          rideStartTime: new Date(currentTime.getTime() + secondsToRideStart * 1000 + 30 * 1000),
          userArrivalAtDestVBS: new Date(currentTime.getTime() + secondsToRideStart * 1000 + 30 * 1000 + toEndVBDuration * 1000),
          toStartVBDuration: toStartVBDuration,
          potentialCutOffStep: potentialCutOffStep
        })

        // Case: Van has not picked up passenger yet and new Passenger wants to enter in at same vbs
        // If possible van will pick up both passengers and then either deliver the original passenger first or the new passenger
      } else if (van.nextStops.length === 2 && _.first(van.nextStops).vb.equals(fromVB)) {
        Logger.info('First bus stop is same')

        // make sure van does not arrive within 60 seconds so that it does not go into waiting before order can be confirmed
        if (van.nextStopTime.getTime() - currentTime.getTime() < 60 * 1000) continue

        // Calculate the new Time for the van to leave at the the VBS where both passengers enter
        const origPassRideStartTime = otherPasRoute.vanETAatStartVBS
        const newPassWalkingArrivalTime = new Date(currentTime.getTime() + walkingTimeToStartVB * 1000)

        const vanArrivalTime = van.nextStopTime
        const newVanStartTime = newPassWalkingArrivalTime > origPassRideStartTime ? newPassWalkingArrivalTime : origPassRideStartTime

        // Calculate the extra waiting times for both passengers in milliseconds
        // new passenger waiting time is either difference between the arrivals of the two passengers or between the orig pass' arrival time and the van arrival time
        // We have to deduct the 30 seconds that have been added to the ride start time of the original passenger
        let newPassExtraWaitingTimeAtVBS = 0
        if (newPassWalkingArrivalTime > vanArrivalTime) {
          newPassExtraWaitingTimeAtVBS = Math.max(0, (origPassRideStartTime.getTime() - 30 * 1000) - newPassWalkingArrivalTime.getTime())
        } else {
          newPassExtraWaitingTimeAtVBS = Math.max(0, (origPassRideStartTime.getTime() - 30 * 1000) - vanArrivalTime.getTime())
        }
        const origPassExtraWaitingTimeAtVBS = Math.max(0, newPassWalkingArrivalTime.getTime() - (origPassRideStartTime.getTime() - 30 * 1000))

        // Route Naming Logic:
        // origPass & newPass start VBS: A1, origPass end VBS: A2, newPass end VBS: B2,
        const fromA1ToB2 = await GoogleMapsHelper.simpleGoogleRoute(van.nextStops[0].vb.location, toVB.location)
        const fromA1ToB2Dur = GoogleMapsHelper.readDurationFromGoogleResponse(fromA1ToB2)

        const fromA1ToA2Dur = GoogleMapsHelper.readDurationFromGoogleResponse(van.nextRoutes[1])

        const fromA2ToB2 = await GoogleMapsHelper.simpleGoogleRoute(van.nextStops[1].vb.location, toVB.location)
        const fromA2ToB2Dur = GoogleMapsHelper.readDurationFromGoogleResponse(fromA2ToB2)

        const fromB2ToA2 = await GoogleMapsHelper.simpleGoogleRoute(toVB.location, van.nextStops[1].vb.location)
        const fromB2ToA2Dur = GoogleMapsHelper.readDurationFromGoogleResponse(fromB2ToA2)

        // Compare the times of the routes

        // Check first: Is the pure route of the new passenger minus pooling route (incl. extra waiting time) small than ten minutes
        // durations in seconds
        const isA1A2B2Allowed = threshold > fromA1ToB2Dur - (fromA1ToA2Dur + fromA2ToB2Dur + 30 + newPassExtraWaitingTimeAtVBS / 1000)

        // Check second: if new route is maximum of 10 minutes longer for origPass
        // Since the guaranteed time of arrival of the orig passenger is a time point (not duration) we have to work with dates (in seconds from origin)
        const isA1B2A2Allowed = threshold > otherPasRoute.vanETAatEndVBS.getTime() / 1000 - (origPassRideStartTime / 1000 + origPassExtraWaitingTimeAtVBS / 1000 + fromA1ToB2Dur + fromB2ToA2Dur)

        // Compare the times of the routes
        const isA1B2A2Better = !(fromA1ToA2Dur + fromA2ToB2Dur < fromA1ToB2Dur + fromB2ToA2Dur)

        // Now apply the pooling
        if (isA1A2B2Allowed && !(isA1B2A2Allowed && isA1B2A2Better)) {
          possibleVans.push({
            vanId: van.vanId,
            potentialNewRoute: [van.nextRoutes[0], van.nextRoutes[1], fromA2ToB2],
            rideStartTime: newVanStartTime,
            potentialStops: [fromVB, fromVB, van.nextStops[1].vb, toVB],
            userArrivalAtDestVBS: new Date(newVanStartTime.getTime() + fromA1ToA2Dur * 1000 + 30 * 1000 + fromA2ToB2Dur * 1000),
            userVanRoute: [van.nextRoutes[1], fromA2ToB2],
            toStartVBDuration: (currentTime.getTime() - van.nextStopTime.getTime()) * 1000,
            potentialCutOffStep: null
          })
          // Pooling is allowed
          continue
        }

        if (isA1B2A2Allowed) {
          // Pooling is allowed
          possibleVans.push({
            vanId: van.vanId,
            potentialNewRoute: [van.nextRoutes[0], fromA1ToB2, fromB2ToA2],
            userVanRoute: [fromA1ToB2],
            potentialStops: [fromVB, fromVB, toVB, van.nextStops[1].vb],
            rideStartTime: newVanStartTime,
            userArrivalAtDestVBS: new Date(newVanStartTime.getTime() + fromA1ToB2Dur * 1000 + 30 * 1000 + fromB2ToA2Dur * 1000),
            toStartVBDuration: (currentTime.getTime() - van.nextStopTime.getTime()) * 1000,
            potentialCutOffStep: null
          })
        }
      }

      // Test 3 startVB oder destVB gleich
    }
    return _.sortBy(possibleVans, ['toStartVBDuration'])
  }

  static getBestVan (possibleVans, vans) {
    while (possibleVans.length > 0) {
      // get next best van
      const tmpVan = possibleVans.shift()
      // make sure the van is still available
      if (vans[tmpVan.vanId - 1].potentialRoute.length === 0) {
        return tmpVan
      }
    }
    return null // no van found
  }

  static async requestBestVan (start, fromVB, toVB, walkingTimeToStartVB, passengerCount, vans) {
    // get walking time

    const possibleVans = await this.getPossibleVans(fromVB, toVB, walkingTimeToStartVB, passengerCount, vans)
    return this.getBestVan(possibleVans, vans)
  }
}

module.exports = VanRequestService
