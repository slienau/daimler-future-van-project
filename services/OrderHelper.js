const VirtualBusStop = require('../models/VirtualBusStop.js')
const Order = require('../models/Order.js')
const Account = require('../models/Account.js')
const Route = require('../models/Route.js')
const ManagementSystem = require('./ManagementSystem.js')
const GoogleMapsHelper = require('../services/GoogleMapsHelper.js')
const Loyalty = require('./Loyalty.js')
const geolib = require('geolib')
const Logger = require('./WinstonLogger').logger
const _ = require('lodash')

// range in meter how far the van and user can be from the vbs to still be able to start/end the ride
const range = 25

class OrderHelper {
  static async setupOrders () {
    const items = await Order.find({})

    if (items !== null && items.length !== 0) return Logger.info('no setup needed')

    let user, userId, vbs
    let orderTime1, orderTime2, time1Start, time1End, time2Start, time2End, distance1, distance2, distance3
    let accountnames = ['christoph', 'sebastian', 'antonio', 'alex', 'domenic', 'marius', 'philipp']
    let leaderboardDifference = 1.6

    for (let i = 0; i < accountnames.length; i++) {
      try {
        user = await Account.findOne({ 'username': accountnames[i] })
        userId = user._id
        try {
          vbs = await VirtualBusStop.find({})
        } catch (error) {
          Logger.error(error)
        }
        orderTime1 = new Date('2018-12-10T12:30:00')
        orderTime2 = new Date('2018-12-13T10:00:00')
        time1Start = new Date('2018-12-10T13:00:00')
        time1End = new Date('2018-12-10T13:30:00')
        time2Start = new Date('2018-12-13T10:15:00')
        time2End = new Date('2018-12-13T10:30:00')
        distance1 = 6
        distance2 = 4
        distance3 = 7.5

        const order1 = new Order({

          accountId: userId,
          orderTime: orderTime1,
          active: false,
          canceled: false,
          vanStartVBS: vbs[0]._id,
          vanEndVBS: vbs[1]._id,
          vanEnterTime: time1Start,
          vanExitTime: time1End,
          vanId: 3,
          distance: distance1,
          loyaltyPoints: Number((distance1 * 10 * leaderboardDifference).toFixed(0)),
          co2savings: distance1 * 0.13,
          route: '273jsnsb9201'
        })

        const order2 = new Order({

          accountId: userId,
          orderTime: orderTime2,
          active: false,
          canceled: false,
          vanStartVBS: vbs[1]._id,
          vanEndVBS: vbs[0]._id,
          vanEnterTime: time2Start,
          vanExitTime: time2End,
          vanId: 4,
          distance: distance2,
          loyaltyPoints: Number((distance2 * 10 * leaderboardDifference).toFixed(0)),
          co2savings: distance2 * 0.13,
          route: '273jsnsb9250'
        })

        const order3 = new Order({
          accountId: userId,
          orderTime: orderTime2,
          active: false,
          canceled: false,
          vanStartVBS: vbs[1]._id,
          vanEndVBS: vbs[0]._id,
          vanEnterTime: time2Start,
          vanExitTime: time2End,
          vanId: 4,
          distance: distance3,
          loyaltyPoints: Number((distance3 * 10 * leaderboardDifference).toFixed(0)),
          co2savings: distance3 * 0.13,
          route: '273jsnsb9250'
        })

        await order1.save()
        await order2.save()
        await order3.save()
        leaderboardDifference -= 0.2
      } catch (error) {
        Logger.error(error)
      }
    }
  }

  // Creates an order Object and stores this in the db
  static async createOrder (accountId, routeId) {
    const currentTime = new Date()
    const route = await Route.findById(routeId)
    const timePassed = currentTime.getTime() - (route.validUntil.getTime() - 60 * 1000)

    const virtualBusStopStart = route.vanStartVBS
    const virtualBusStopEnd = route.vanEndVBS

    // Check if Route is still valid, if not return an error
    if (route.validUntil < new Date(Date.now() + 1000)) return { code: 400, message: 'your route is no longer valid, please get a new route' }

    const vanId = route.vanId
    const vanArrivalTime = new Date(Date.now() + ManagementSystem.vans[vanId - 1].potentialRoute[0].routes[0].legs[0].duration.value * 1000)
    if (!vanArrivalTime) return { code: 400, message: 'old van route is corrupted' }

    await Route.updateOne({ _id: routeId }, { $set: {
      confirmed: true,
      journeyStartTime: currentTime,
      vanETAatStartVBS: route.vanETAatStartVBS + timePassed,
      vanETAatEndVBS: route.vanETAatEndVBS + timePassed,
      userETAatUserDestinationLocation: route.userETAatUserDestinationLocation + timePassed
    }
    })

    const vbs = []
    try {
      vbs[0] = await VirtualBusStop.findById(virtualBusStopStart)
      vbs[1] = await VirtualBusStop.findById(virtualBusStopEnd)
    } catch (error) {
      return error
    }
    let loyalty = Loyalty.loyaltyPoints(route)

    let newOrder
    try {
      newOrder = new Order({

        accountId: accountId,
        orderTime: new Date(),
        active: true,
        canceled: false,
        vanStartVBS: vbs[0]._id,
        vanEndVBS: vbs[1]._id,
        vanEnterTime: null,
        vanExitTime: null,
        vanId: vanId,
        route: routeId,
        distance: loyalty.distance,
        loyaltyPoints: loyalty.loyaltyPoints,
        co2savings: loyalty.co2savings

      })
    } catch (e) {
      Logger.error(e)
    }

    const passengerCount = route.passengerCount ? route.passengerCount : 1
    try {
      const order = await newOrder.save()
      await ManagementSystem.confirmVan(vbs[0], vbs[1], vanId, order, passengerCount)

      return order._id
    } catch (error) {
      Logger.error(error)
      return error
    }
  }

  // To-Do: Only rely on location instead of time
  static async checkOrderLocationStatus (orderId, passengerLocation) {
    const order = await Order.findById(orderId).lean()
    const route = await Route.findById(order.route).lean()
    const virtualBusStopStart = await VirtualBusStop.findById(order.vanStartVBS).lean()
    const virtualBusStopEnd = await VirtualBusStop.findById(order.vanEndVBS).lean()

    // TODO get vanArrival Time from VAN
    const van = ManagementSystem.vans[order.vanId - 1]
    const vanLocation = ManagementSystem.vans[order.vanId - 1].lastStepLocation
    const actualVanLocation = ManagementSystem.vans[order.vanId - 1].location

    const nextStops = ManagementSystem.vans[order.vanId - 1].nextStops
    const nextRoutes = ManagementSystem.vans[order.vanId - 1].nextRoutes

    // counter counts through the Virtual bus stops, while routesCouter counts through the routes
    let counter = 0
    let routesCounter = 0
    let myStops = []
    let arrivalTimes = []
    let otherOrder, otherUser, arrivalTime
    let otherPassengers = []

    // We are trying to allign the routes in nextRoutes with stops in nextStops, the cushion helps to cover different cases
    // the routeCushion is necessary for the case that the first route has been cut in two at a cut-off step
    // also the routeCushion accounts for when the van is waiting --> one route less
    const uniqueStopCount = _.uniqWith(nextStops, (val1, val2) => val1.vb._id.equals(val2.vb._id)).length
    let routeCushion = uniqueStopCount < nextRoutes.length ? 1 : 0
    routeCushion += ManagementSystem.vans[order.vanId - 1].waiting ? -1 : 0

    // iterate through next stops to get potential other passengers and find out what stops we get on and off
    for (let stop of nextStops) {
      // fill the arrival time
      if (counter === 0) {
        arrivalTimes.push(ManagementSystem.vans[order.vanId - 1].nextStopTime)
        routesCounter++
      } else {
        // arrivalTime is same as before if the vbs are equal
        if (nextStops[counter].vb.equals(nextStops[counter - 1].vb)) {
          arrivalTime = arrivalTimes[counter - 1]
        } else {
          // arrivalTime is freshly calculated because vbs is different than its predecessor --> new route; update routesCounter
          arrivalTime = new Date(arrivalTimes[counter - 1].getTime() + GoogleMapsHelper.readDurationFromGoogleResponse(nextRoutes[routesCounter + routeCushion]) * 1000 + 30 * 1000)
          routesCounter++
        }
        arrivalTimes.push(arrivalTime)
      }
      // check if stop belongs to me. if yes store arrivalTimes if not store userName
      if (orderId.equals(stop.orderId)) {
        myStops.push({ index: counter, arrivalTime: arrivalTimes[counter] })
      } else {
        otherOrder = await Order.findById(stop.orderId).lean()
        otherUser = await Account.findById(otherOrder.accountId).lean()
        if (!_.includes(otherPassengers, otherUser.username)) {
          otherPassengers.push(otherUser.username)
        }
      }
      counter++
    }

    const startVBSTime = order.vanEnterTime ? order.vanEnterTime : myStops[0].arrivalTime
    const endVBSTime = order.vanEnterTime ? myStops[0].arrivalTime : myStops[1].arrivalTime

    const uniqueStops = _.uniqWith(nextStops, (stop1, stop2) => stop1.vb._id.equals(stop2.vb._id)).map(stop => stop.vb)
    const res = {
      vanId: order.vanId,
      userAllowedToEnter: false,
      userAllowedToExit: false,
      message: 'unknown state',
      guaranteedArrivalTime: new Date(route.vanETAatEndVBS.getTime() + 10 * 60 * 1000),
      vanETAatStartVBS: startVBSTime,
      vanETAatDestinationVBS: endVBSTime,
      otherPassengers: otherPassengers,
      vanLocation: actualVanLocation,
      nextStops: uniqueStops,
      nextRoutes: nextRoutes
    }

    if (!order.vanEnterTime) {
      if (geolib.getDistance(vanLocation, virtualBusStopStart.location) > range) return { ...res, message: 'Van has not arrived yet.' }
      res.userAllowedToEnter = geolib.getDistance(virtualBusStopStart.location, passengerLocation) < range && van.waiting
      res.userAllowedToExit = false
      res.message = res.userAllowedToEnter ? 'Van is ready to be entered.' : 'Van is ready, but passenger is not close enough to the van.'
    } else {
      res.userAllowedToEnter = false
      res.userAllowedToExit = geolib.getDistance(virtualBusStopEnd.location, vanLocation) < range && van.waiting
      res.message = res.userAllowedToExit ? 'Van is ready to be exited.' : 'You have not arrived at the destination virtual bus stop yet.'
    }
    return res
  }
}

module.exports = OrderHelper
