const express = require('express')
const router = express.Router()
const Order = require('../models/Order.js')
const VirtualBusStop = require('../models/VirtualBusStop.js')
const OrderHelper = require('../services/OrderHelper')

router.get('/', async function (req, res) {
  const orders = await Order.find({ 'accountID': req.user._id })
  const ordersObject = JSON.parse(JSON.stringify(orders))
  res.setHeader('Content-Type', 'application/json')

  try {
    for (const ord in ordersObject) {
      const vb1 = await VirtualBusStop.findById(ordersObject[ord].virtualBusStopStart)
      const vb2 = await VirtualBusStop.findById(ordersObject[ord].virtualBusStopEnd)
      ordersObject[ord].virtualBusStopStart = vb1
      ordersObject[ord].virtualBusStopEnd = vb2
    }
  } catch (error) {
    console.log(error)
  }
  res.json(ordersObject)
})

router.get('/:orderId/status', async function (req, res) {
  console.log('Get Status zu OrderID: ' + req.params.orderId + ' mit query:')
  console.log(req.query)
  res.setHeader('Content-Type', 'application/json')

  if (!req.params.orderId || !req.query.passengerLatitude || !req.query.passengerLongitude) res.json({ code: 400, message: 'Bad params, you need passengerLongitude and passengerLatitude' })

  const result = await OrderHelper.checkOrderLocationStatus(req.params.orderId, { latitude: req.query.passengerLatitude, longitude: req.query.passengerLongitude })

  res.json(result)
})

router.post('/', async function (req, res) {
  console.log('Request to Post Orders with body: ')
  console.log(req.body)

  res.setHeader('Content-Type', 'application/json')

  const accountID = req.user._id
  // test if parameters are there
  if (!req.body.start || !req.body.destination || !req.body.vanId) res.json({ code: 400, message: 'bad parameters, you need start, destination, and vanId (from route request)' })

  const vb1 = req.body.start
  const vb2 = req.body.destination
  const vanId = req.body.vanId

  let order, orderId

  try {
    orderId = await OrderHelper.createOrder(accountID, vb1, vb2, vanId)
  } catch (error) {
    console.log(error)
    res.json(error)
  }
  try {
    order = await Order.findById(orderId)
  } catch (error) {
    res.json(error)
  }
  console.log('created active order for user ' + accountID + ' with orderId: ' + orderId)
  res.json(order)
})

router.put('/:orderId', async function (req, res) {
  console.log('Put Request to Order : ' + req.query.orderId)
  console.log('Put Request to Order : ' + req.params.orderId)

  const orderId = req.params.orderId || req.query.orderId

  if (!req.query.orderId && !req.params.orderId) res.json({ code: 400, description: 'No orderId as been sent as param.', reasonPhrase: 'Bad Request' })

  if (req.body.canceled) {
    await Order.updateOne({ _id: orderId }, { $set: { canceled: req.body.canceled, endTime: new Date() } })
  }
  if (req.body.active) {
    await Order.updateOne({ _id: orderId }, { $set: { active: req.body.active, endTime: new Date() } })
  }
  const order = await Order.findById(orderId)
  res.json(order)
})

module.exports = router
