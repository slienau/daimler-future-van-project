const express = require('express')
const router = express.Router()
const Order = require('../models/Order.js')
const VirtualBusStop = require('../models/VirtualBusStop.js')
const OrderHelper = require('../services/OrderHelper')
const ManagementSystem = require('../services/ManagementSystem.js')
const Route = require('../models/Route.js')
const geolib = require('geolib')

router.get('/status', async function (req, res) {
  console.log('Get activeOrder status request zu user: ' + req.user._id + ' with Query: ')
  console.log(req.query)

  res.setHeader('Content-Type', 'application/json')

  if (!req.query.passengerLatitude || !req.query.passengerLongitude) res.status(400).json({ code: 400, description: 'Bad params, you need passengerLongitude and passengerLatitude' })

  ManagementSystem.updateVanLocations()
  const order = await Order.findOne({ accountId: req.user._id, active: true })

  if (!order) res.status(404).json({ code: 404, description: 'No active order' })

  const result = await OrderHelper.checkOrderLocationStatus(order._id, { latitude: req.query.passengerLatitude, longitude: req.query.passengerLongitude })

  res.json(result)
})

router.get('/', async function (req, res) {
  console.log('Get activeOrder request zu user: ' + req.user._id)

  res.setHeader('Content-Type', 'application/json')

  const order = await Order.findOne({ accountId: req.user._id, active: true })
  const orderLean = await Order.findById(order._id).lean()
  orderLean.id = order._id

  orderLean.route = await Route.findById(order.route, '-confirmed -validUntil')

  res.json(orderLean)
})

router.put('/', async function (req, res) {
  console.log('Put activeOrder request zu user: ' + req.user._id + ' mit Action: ' + req.body.action)

  if (!req.body.userLocation.latitude || !req.body.userLocation.longitude) res.status(400).json({ code: 400, description: 'Bad params, you need userLocation' })

  const order = await Order.findOne({ accountId: req.user._id, active: true })
  if (!order) return res.status(404).json({ code: 404, description: 'user has no active order' })

  const orderId = order._id

  const virtualBusStop = await VirtualBusStop.findById(order.virtualBusStopStart)

  let orderNew

  ManagementSystem.updateVanLocations()

  switch (req.body.action) {
    case 'startride':

      if (geolib.getDistance({ latitude: virtualBusStop.location.latitude, longitude: virtualBusStop.location.longitude }, { latitude: req.body.userLocation.latitude, longitude: req.body.userLocation.longitude }) > 10) {
        res.status(403).json({ code: 403, description: 'User is not close enough to the van.' })
        break
      } else if (new Date() < order.vanArrivalTime) {
        res.status(403).json({ code: 403, description: 'Van has not arrived at the virtual bus stop yet.' })
        break
      } else if (order.startTime) {
        res.status(403).json({ code: 403, description: 'Ride has already been started.' })
        break
      }
      let res2 = await ManagementSystem.startRide(order)
      if (!res2) {
        res.status(403).json({ code: 403, description: 'Van not yet waiting.' })
        break
      }

      await Order.updateOne({ _id: orderId }, { $set: { startTime: new Date() } })

      // await ManagementSystem.startRide(order)

      orderNew = await Order.findById(orderId)
      res.json(orderNew)
      break

    case 'endride':
      if (!order.startTime) {
        res.status(403).json({ code: 403, description: 'The ride has not yet started.' })
        break
      } else if (new Date() < order.vanEndTime) {
        res.status(403).json({ code: 403, description: 'Van has not arrived at its destination yet.' })
        break
      }
      let res3 = await ManagementSystem.endRide(order)
      if (!res3) {
        res.status(403).json({ code: 403, description: 'Van not yet waiting.' })
        break
      }
      await Order.updateOne({ _id: orderId }, { $set: { endTime: new Date(), active: false } })

      // await ManagementSystem.endRide(order)

      orderNew = await Order.findById(orderId)
      res.json(orderNew)
      break

    case 'cancel':
      if (order.startTime) {
        res.status(403).json({ code: 403, description: 'Cannot be canceled. Ride has already started.' })
        break
      }
      await Order.updateOne({ _id: orderId }, { $set: { canceled: true, endTime: new Date(), active: false } })

      await ManagementSystem.cancelRide(order)

      orderNew = await Order.findById(orderId)
      res.json(orderNew)
      break
    default:
      res.status(400).json({ code: 400, description: 'Bad action parameter' })
  }
})

module.exports = router
