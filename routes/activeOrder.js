const express = require('express')
const router = express.Router()
const Order = require('../models/Order.js')
const VirtualBusStop = require('../models/VirtualBusStop.js')
const OrderHelper = require('../services/OrderHelper')
const geolib = require('geolib')

router.get('/status', async function (req, res) {
  console.log('Get activeOrder status request zu user: ' + req.user._id + ' with Query: ')
  console.log(req.query)

  res.setHeader('Content-Type', 'application/json')

  if (!req.query.passengerLatitude || !req.query.passengerLongitude) res.json({ code: 400, message: 'Bad params, you need passengerLongitude and passengerLatitude' })

  const order = await Order.findOne({ accountId: req.user._id, active: true })

  if (!order) res.json({ code: 400, message: 'No active order' })

  const result = await OrderHelper.checkOrderLocationStatus(order._id, { latitude: req.query.passengerLatitude, longitude: req.query.passengerLongitude })

  res.json(result)
})

router.get('/', async function (req, res) {
  console.log('Get activeOrder request zu user: ' + req.user._id)

  res.setHeader('Content-Type', 'application/json')

  const order = await Order.findOne({ accountId: req.user._id, active: true })

  res.json(order)
})

router.put('/', async function (req, res) {
  console.log('Put activeOrder request zu user: ' + req.user._id + ' mit Action: ' + req.body.action)

  if (!req.query.passengerLatitude || !req.query.passengerLongitude) res.json({ code: 400, message: 'Bad params, you need passengerLongitude and passengerLatitude' })

  const order = await Order.findOne({ accountId: req.user._id, active: true })
  if (!order) res.json({ code: 400, message: 'No active order' })

  const orderId = order._id

  const virtualBusStop = await VirtualBusStop.findById(order.virtualBusStopStart)

  let orderNew

  switch (req.body.action) {
    case 'startride':

      if (geolib.getDistance({ latitude: virtualBusStop.location.latitude, longitude: virtualBusStop.location.longitude }, { latitude: req.query.passengerLatitude, longitude: req.query.passengerLongitude }) > 10) {
        res.json({ code: 403, message: 'User is not close enough to the van.' })
        break
      } else if (new Date() < order.vanArrivalTime) {
        res.json({ code: 403, message: 'Van has not arrived at the virtual bus stop yet.' })
        break
      } else if (order.startTime) {
        res.json({ code: 403, message: 'Ride has already been started.' })
        break
      }
      await Order.updateOne({ _id: orderId }, { $set: { startTime: new Date() } })
      orderNew = await Order.findById(orderId)
      res.json(orderNew)
      break
    case 'endride':
      if (!order.startTime) {
        res.json({ code: 403, message: 'The ride has not yet started.' })
        break
      } else if (new Date() < order.vanEndTime) {
        res.json({ code: 403, message: 'Van has not arrived at its destination yet.' })
        break
      }
      await Order.updateOne({ _id: orderId }, { $set: { endTime: new Date(), active: false } })
      orderNew = await Order.findById(orderId)
      res.json(orderNew)
      break
    case 'cancel':
      if (order.startTime) {
        res.json({ code: 403, message: 'Cannot be canceled. Ride has already started.' })
        break
      }
      await Order.updateOne({ _id: orderId }, { $set: { canceled: true, endTime: new Date(), active: false } })
      orderNew = await Order.findById(orderId)
      res.json(orderNew)
      break
    default:
      res.json({ code: 400, message: 'Bad action parameter' })
  }
})

module.exports = router
