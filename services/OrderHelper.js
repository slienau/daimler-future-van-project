const VirtualBusStop = require('../models/VirtualBusStop.js')
const Order = require('../models/Order.js')
const Account = require('../models/Account.js')
const Route = require('../models/Route.js')
const ManagementSystem = require('./ManagementSystem.js')
const geolib = require('geolib')
const bonusMultiplierStandard = 10
const co2savingsMultiplierStandard = 0.13 // EU limit for new cars = 0.13 kg/km

class OrderHelper {
  // Check if any users are there and if not create two static users
  static async setupOrders () {
    const items = await Order.find({})

    if (items !== null && items.length !== 0) return console.log('no setup needed')

    let user, userId, vbs
    let orderTime1, orderTime2, time1Start, time1End, time2Start, time2End, distance1, distance2, distance3
    let accountnames = ['admin', 'maexle', 'christoph', 'sebastian', 'alex', 'domenic', 'marius', 'philipp', 'antonio']

    for (let i = 0; i < accountnames.length; i++) {
      try {
        user = await Account.findOne({ 'username': accountnames[i] })
        userId = user._id
        try {
          vbs = await VirtualBusStop.find({})
        } catch (error) {
          console.log(error)
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
          loyaltyPoints: distance1 * bonusMultiplierStandard,
          co2savings: distance1 * co2savingsMultiplierStandard,
          bonusMultiplier: bonusMultiplierStandard,
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
          loyaltyPoints: distance2 * bonusMultiplierStandard,
          co2savings: distance2 * co2savingsMultiplierStandard,
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
          loyaltyPoints: distance3 * bonusMultiplierStandard,
          co2savings: distance3 * co2savingsMultiplierStandard,
          route: '273jsnsb9250'
        })

        await order1.save()
        await order2.save()
        await order3.save()
      } catch (error) {
        console.log(error)
      }
    }
  }

  // Creates an order Object and stores this in the db
  static async createOrder (accountId, routeId) {
    const currentTime = new Date()
    const route = await Route.findById(routeId)
    const timePassed = currentTime.getTime() - (route.validUntil.getTime() - 60 * 1000)

    console.log('------------------------')
    console.log('timepassed: ' + timePassed)
    console.log('------------------------')

    const virtualBusStopStart = route.vanStartVBS
    const virtualBusStopEnd = route.vanEndVBS

    // Check if Route is still valid, if not return an error
    if (route.validUntil < new Date(Date.now() + 1000)) return { code: 404, message: 'your route is no longer valid, please get a new route' }

    const vanId = route.vanId
    const vanArrivalTime = new Date(Date.now() + ManagementSystem.vans[vanId - 1].potentialRoute.routes[0].legs[0].duration.value * 1000)
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

    const newVan = await ManagementSystem.confirmVan(vbs[0], vbs[1], vanId)

    console.log('------------------------')
    console.log('old van Arrival Time: ' + vanArrivalTime)
    console.log('------------------------')

    console.log('------------------------')
    console.log('new van Arrival Time: ' + newVan.nextStopTime)
    console.log('------------------------')

    const distance = route.vanRoute.routes[0].legs[0].distance.value / 1000

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
        distance: distance,
        loyaltyPoints: distance * bonusMultiplierStandard,
        co2savings: distance * co2savingsMultiplierStandard,
        bonusMultiplier: bonusMultiplierStandard

      })
    } catch (e) {
      console.log(e)
    }

    try {
      const obj = await newOrder.save()

      return obj._id
    } catch (error) {
      console.log(error)
      return error
    }
  }

  // To-Do: Only rely on location instead of time
  static async checkOrderLocationStatus (orderId, passengerLocation) {
    const order = await Order.findById(orderId).lean()
    const virtualBusStopStart = await VirtualBusStop.findById(order.vanStartVBS).lean()
    const virtualBusStopEnd = await VirtualBusStop.findById(order.vanEndVBS).lean()

    // TODO get vanArrival Time from VAN
    const vanLocation = ManagementSystem.vans[order.vanId - 1].location

    console.log('Van location at status:')
    console.log(vanLocation)
    console.log(virtualBusStopStart.location)
    console.log(virtualBusStopEnd.location)

    const res = {
      userAllowedToEnter: false,
      userAllowedToExit: false,
      message: 'unknown state',
      vanLocation: vanLocation
    }

    if (!order.vanEnterTime) {
      if (geolib.getDistance(vanLocation, virtualBusStopStart.location) > 10) return { ...res, message: 'Van has not arrived yet.' }
      res.userAllowedToEnter = geolib.getDistance(virtualBusStopStart.location, passengerLocation) < 10
      res.userAllowedToExit = false
      res.message = res.userAllowedToEnter ? 'Van is ready to be entered.' : 'Van is ready, but passenger is not close enough to the van.'
    } else {
      res.userAllowedToEnter = false
      res.userAllowedToExit = geolib.getDistance(virtualBusStopEnd.location, vanLocation) < 10
      res.message = res.userAllowedToExit ? 'Van is ready to be exited.' : 'You have not arrived at the destination virtual bus stop yet.'
    }
    return res
  }
}

module.exports = OrderHelper
