const VirtualBusStop = require('../models/VirtualBusStop.js')
const Order = require('../models/Order.js')
const Account = require('../models/Account.js')

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
      endTime: time1End
    })

    const order2 = new Order({

      accountID: accountID,
      orderTime: orderTime2,
      active: false,
      canceled: false,
      virtualBusStopStart: vbs[1]._id,
      virtualBusStopEnd: vbs[0]._id,
      startTime: time2Start,
      endTime: time2End
    })

    await order1.save()
    await order2.save()
  }

  static async createOrder (accountID, virtualBusStopStart, virtualBusStopEnd, startTime, arrivalTime) {
    const vbs = []
    try {
      vbs[0] = await VirtualBusStop.findById(virtualBusStopStart)
      vbs[1] = await VirtualBusStop.findById(virtualBusStopEnd)
    } catch (error) {
      return error
    }

    const pickupTime = startTime ? new Date(startTime) : null
    const destTime = startTime ? new Date(startTime) : null

    const newOrder = new Order({

      accountID: accountID,
      orderTime: new Date(),
      active: true,
      canceled: false,
      virtualBusStopStart: vbs[0]._id,
      virtualBusStopEnd: vbs[1]._id,
      startTime: pickupTime,
      endTime: destTime
    })
    try {
      await newOrder.save()
    } catch (error) {
      return error
    }
    return {
      accountID: accountID,
      orderTime: new Date(),
      active: true,
      canceled: false,
      virtualBusStopStart: vbs[0],
      virtualBusStopEnd: vbs[1],
      startTime: pickupTime,
      endTime: destTime
    }
  }
}

module.exports = OrderHelper
