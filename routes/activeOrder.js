const express = require('express')
const router = express.Router()
const Order = require('../models/Order.js')
const VirtualBusStop = require('../models/VirtualBusStop.js')
const OrderHelper = require('../services/OrderHelper')
const ManagementSystem = require('../services/ManagementSystem.js')
const Route = require('../models/Route.js')
const Logger = require('../services/WinstonLogger').logger
const geolib = require('geolib')

const range = 25

router.get('/status', async function (req, res) {
  Logger.info('Get activeOrder status request zu user: ' + req.user._id + ' with Query: ')
  Logger.info(req.query)

  res.setHeader('Content-Type', 'application/json')

  if (!req.query.passengerLatitude || !req.query.passengerLongitude) return res.status(400).json({ code: 400, description: 'Bad params, you need passengerLongitude and passengerLatitude' })

  await ManagementSystem.updateVanLocations()
  const order = await Order.findOne({ accountId: req.user._id, active: true })

  if (!order) return res.status(404).json({ code: 404, description: 'No active order' })

  const result = await OrderHelper.checkOrderLocationStatus(order._id, { latitude: req.query.passengerLatitude, longitude: req.query.passengerLongitude })

  res.json(result)
})

router.get('/', async function (req, res) {
  Logger.info('Get activeOrder request zu user: ' + req.user._id)

  res.setHeader('Content-Type', 'application/json')

  const order = await Order.findOne({ accountId: req.user._id, active: true })
  if (!order) return res.status(404).json({ message: 'no order active' })
  const orderLean = await Order.findById(order._id).lean()
  orderLean.id = order._id

  orderLean.route = await Route.findById(order.route, '-confirmed -validUntil')
  orderLean.vanStartVBS = await VirtualBusStop.findById(order.vanStartVBS).lean()
  orderLean.vanEndVBS = await VirtualBusStop.findById(order.vanEndVBS).lean()

  res.json(orderLean)
})

// TODO chekc for van location instead of time
router.put('/', async function (req, res) {
  Logger.info('Put activeOrder request zu user: ' + req.user._id + ' mit Action: ' + req.body.action)

  if (!req.body.userLocation.latitude || !req.body.userLocation.longitude) res.status(400).json({ code: 400, description: 'Bad params, you need userLocation' })

  await ManagementSystem.updateVanLocations()

  const order = await Order.findOne({ accountId: req.user._id, active: true })
  if (!order) return res.status(404).json({ code: 404, description: 'user has no active order' })

  const orderId = order._id

  const virtualBusStop = await VirtualBusStop.findById(order.vanStartVBS)
  const virtualBusStopEnd = await VirtualBusStop.findById(order.vanEndVBS)

  let orderNew

  const vanId = order.vanId
  const van = ManagementSystem.vans[vanId - 1]
  const vanLocation = van.location

  switch (req.body.action) {
    case 'startride':

      if (geolib.getDistance({ latitude: virtualBusStop.location.latitude, longitude: virtualBusStop.location.longitude }, { latitude: req.body.userLocation.latitude, longitude: req.body.userLocation.longitude }) > range) {
        return res.status(403).json({ code: 403, description: 'User is not close enough to the van.' })
      } else if (geolib.getDistance({ latitude: virtualBusStop.location.latitude, longitude: virtualBusStop.location.longitude }, { latitude: vanLocation.latitude, longitude: vanLocation.longitude }) > range) {
        return res.status(403).json({ code: 403, description: 'Van has not arrived at the virtual bus stop yet.' })
      } else if (order.vanEnterTime) {
        return res.status(403).json({ code: 403, description: 'Ride has already been started.' })
      } else if (!van.waiting) {
        return res.status(403).json({ code: 403, description: 'Van is not yet waiting.' })
      }
      await ManagementSystem.startRide(order)

      await Order.updateOne({ _id: orderId }, { $set: { vanEnterTime: new Date() } })

      // await ManagementSystem.startRide(order)

      orderNew = await Order.findById(orderId)
      res.json(orderNew)
      break

    case 'endride':
      if (!order.vanEnterTime) {
        return res.status(403).json({ code: 403, description: 'The ride has not yet started.' })
      } else if (geolib.getDistance({ latitude: virtualBusStopEnd.location.latitude, longitude: virtualBusStopEnd.location.longitude }, { latitude: vanLocation.latitude, longitude: vanLocation.longitude }) > range) {
        return res.status(403).json({ code: 403, description: 'Van has not arrived at its destination yet.' })
      } else if (!van.waiting) {
        return res.status(403).json({ code: 403, description: 'Van is not yet waiting.' })
      }
      await ManagementSystem.endRide(order)

      await Order.updateOne({ _id: orderId }, { $set: { vanExitTime: new Date(), active: false } })

      // await ManagementSystem.endRide(order)

      orderNew = await Order.findById(orderId)
      res.json(orderNew)
      break

    case 'cancel':
      if (order.vanEnterTime) {
        return res.status(403).json({ code: 403, description: 'Cannot be canceled. Ride has already started.' })
      }
      await ManagementSystem.cancelRide(order)

      await Order.updateOne({ _id: orderId }, { $set: { canceled: true, vanExitTime: new Date(), active: false } })

      orderNew = await Order.findById(orderId)
      res.json(orderNew)
      break
    default:
      res.status(400).json({ code: 400, description: 'Bad action parameter' })
  }
})

module.exports = router
