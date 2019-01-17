const VirtualBusStop = require('../models/VirtualBusStop.js')
const Order = require('../models/Order.js')
const Account = require('../models/Account.js')
const Route = require('../models/Route.js')
const ManagementSystem = require('./ManagementSystem.js')
const geolib = require('geolib')
const bonusMultiplierStandard = 10

class OrderHelper {
  // Check if any users are there and if not create two static users
  static async setupOrders () {
    const items = await Order.find({})

    if (items !== null && items.length !== 0) return console.log('no setup needed')

    let adminId, maexleId, vbs
    let orderTime1, orderTime2, time1Start, time1End, time2Start, time2End

    try {
      const admin = await Account.findOne({ 'username': 'admin' })
      adminId = admin._id
      const maexle = await Account.findOne({ 'username': 'maexle' })
      maexleId = maexle._id
    } catch (error) {
      console.log(error)
    }

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

    const order1 = new Order({

      accountId: adminId,
      orderTime: orderTime1,
      active: false,
      canceled: false,
      virtualBusStopStart: vbs[0]._id,
      virtualBusStopEnd: vbs[1]._id,
      startTime: time1Start,
      endTime: time1End,
      vanId: 3,
      distance: 6,
      bonuspoints: 6 * bonusMultiplierStandard,
      bonusMultiplier: bonusMultiplierStandard,
      route: '273jsnsb9201',
      vanArrivalTime: new Date(Date.now() - 837268)
    })

    const order2 = new Order({

      accountId: adminId,
      orderTime: orderTime2,
      active: false,
      canceled: false,
      virtualBusStopStart: vbs[1]._id,
      virtualBusStopEnd: vbs[0]._id,
      startTime: time2Start,
      endTime: time2End,
      vanId: 4,
      distance: 7.65,
      bonuspoints: 7.65 * bonusMultiplierStandard,
      bonusMultiplier: bonusMultiplierStandard,
      route: '273jsnsb9250',
      vanArrivalTime: new Date(Date.now() - 587268)
    })

    const order3 = new Order({
      accountId: maexleId,
      orderTime: orderTime2,
      active: false,
      canceled: false,
      virtualBusStopStart: vbs[1]._id,
      virtualBusStopEnd: vbs[0]._id,
      startTime: time2Start,
      endTime: time2End,
      vanId: 4,
      distance: 18,
      bonuspoints: 18 * bonusMultiplierStandard,
      bonusMultiplier: bonusMultiplierStandard,
      route: '273jsnsb9250',
      vanArrivalTime: new Date(Date.now() - 587268)
    })

    await order1.save()
    await order2.save()
    await order3.save()
  }

  // Creates an order Object and stores this in the db
  static async createOrder (accountID, routeId) {
    await Route.updateOne({ _id: routeId }, { $set: { confirmed: true } })
    const route = await Route.findById(routeId)

    // Check if Route is still valid, if not return an error
    if (route.validUntil < new Date(Date.now() + 1000)) return { code: 404, message: 'your route is no longer valid, please get a new route' }

    const virtualBusStopStart = route.startStation
    const virtualBusStopEnd = route.endStation

    const vanId = route.vanId
    const van = { vanId: vanId, vanArrivalTime: ManagementSystem.vanTimes[vanId] }

    const vbs = []
    try {
      vbs[0] = await VirtualBusStop.findById(virtualBusStopStart)
      vbs[1] = await VirtualBusStop.findById(virtualBusStopEnd)
    } catch (error) {
      return error
    }
    const distance = route.vanRoute.routes[0].legs[0].distance.value / 1000

    let newOrder
    try {
      newOrder = new Order({

        accountId: accountID,
        orderTime: new Date(),
        active: true,
        canceled: false,
        virtualBusStopStart: vbs[0]._id,
        virtualBusStopEnd: vbs[1]._id,
        startTime: null,
        endTime: null,
        vanId: van.vanId,
        route: routeId,
        distance: distance,
        vanArrivalTime: van.vanArrivalTime,
        bonuspoints: distance * bonusMultiplierStandard,
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
  static async checkOrderLocationStatus (orderId, passengerLocation) {
    const order = await Order.findById(orderId)
    const virtualBusStop = await VirtualBusStop.findById(order.virtualBusStopStart)
    const vanTime = order.vanArrivalTime
    const vanLocationBeforeArrival = ManagementSystem.vanPositions[order.vanId]

    if (order.active === false) return { userAllowedToEnter: false, message: 'Order is not active', vanPosition: null }
    console.log(virtualBusStop)
    if (new Date() < new Date(vanTime)) return { userAllowedToEnter: false, message: 'Van has not arrived yet', vanPosition: vanLocationBeforeArrival }

    if (geolib.getDistance({ latitude: virtualBusStop.location.latitude, longitude: virtualBusStop.location.longitude }, passengerLocation) > 10) return { userAllowedToEnter: false, message: 'Van is ready, but passenger is not close enough to the van', vanPosition: { latitude: virtualBusStop.location.latitude, longitude: virtualBusStop.location.longitude } }

    return { userAllowedToEnter: true, message: 'Van is ready to be entered.', vanPosition: { latitude: virtualBusStop.location.latitude, longitude: virtualBusStop.location.longitude } }
  }
}

module.exports = OrderHelper
