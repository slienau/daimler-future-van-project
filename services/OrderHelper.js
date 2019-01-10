const VirtualBusStop = require('../models/VirtualBusStop.js')
const Order = require('../models/Order.js')
const Account = require('../models/Account.js')
const ManagementSystem = require('./ManagementSystem.js')
const geolib = require('geolib')

class OrderHelper {
  // Check if any users are there and if not create two static users
  static async setupOrders () {
    const items = await Order.find({})

    if (items !== null && items.length !== 0) return console.log('no setup needed')

    let accountID, vbs
    let orderTime1, orderTime2, time1Start, time1End, time2Start, time2End

    try {
      const item = await Account.findOne({ 'username': 'admin' })
      accountID = item._id
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

      accountID: accountID,
      orderTime: orderTime1,
      active: false,
      canceled: false,
      virtualBusStopStart: vbs[0]._id,
      virtualBusStopEnd: vbs[1]._id,
      startTime: time1Start,
      endTime: time1End,
      vanId: 3,
      vanArrivalTime: new Date(Date.now() - 837268)
    })

    const order2 = new Order({

      accountID: accountID,
      orderTime: orderTime2,
      active: false,
      canceled: false,
      virtualBusStopStart: vbs[1]._id,
      virtualBusStopEnd: vbs[0]._id,
      startTime: time2Start,
      endTime: time2End,
      vanId: 4,
      vanArrivalTime: new Date(Date.now() - 587268)
    })

    await order1.save()
    await order2.save()
  }

  static async createOrder (accountID, virtualBusStopStart, virtualBusStopEnd, vanId) {
    const vbs = []
    try {
      vbs[0] = await VirtualBusStop.findById(virtualBusStopStart)
      vbs[1] = await VirtualBusStop.findById(virtualBusStopEnd)
    } catch (error) {
      return error
    }

    // Set van and the pickup time, which is the later of either the passenger and van arrival times

    const van = { vanId: vanId, vanArrivalTime: ManagementSystem.vanTimes[vanId] }

    let newOrder
    try {
      newOrder = new Order({

        accountID: accountID,
        orderTime: new Date(),
        active: true,
        canceled: false,
        virtualBusStopStart: vbs[0]._id,
        virtualBusStopEnd: vbs[1]._id,
        startTime: null,
        endTime: null,
        vanId: van.vanId,
        vanArrivalTime: van.vanArrivalTime
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

    if (order.active === false) return { status: false, message: 'Order is not active' }
    if (new Date() < new Date(vanTime)) return { status: false, message: 'Van has not arrived yet' }
    if (geolib.getDistance(virtualBusStop.location, passengerLocation) > 10) return { status: false, message: 'Passenger is not close enough to the van' }

    return { status: true, message: 'Van is ready to be entered.' }
  }
}

module.exports = OrderHelper
