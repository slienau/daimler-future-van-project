const express = require('express')
const router = express.Router()
const Order = require('../models/Order.js')
const VirtualBusStop = require('../models/VirtualBusStop.js')
const OrderHelper = require('../services/OrderHelper')
const Route = require('../models/Route.js')

router.get('/', async function (req, res) {
  const orders = await Order.find({ 'accountId': req.user._id })
  const ordersObject = JSON.parse(JSON.stringify(orders))
  res.setHeader('Content-Type', 'application/json')

  try {
    for (const ord in ordersObject) {
      const vb1 = await VirtualBusStop.findById(ordersObject[ord].vanStartVBS)
      const vb2 = await VirtualBusStop.findById(ordersObject[ord].vanEndVBS)
      ordersObject[ord].vanStartVBS = vb1
      ordersObject[ord].vanEndVBS = vb2
    }
  } catch (error) {
    console.log(error)
  }
  res.json(ordersObject)
})

router.post('/', async function (req, res) {
  console.log('Request to Post Orders with body: ')
  console.log(req.body)

  res.setHeader('Content-Type', 'application/json')

  const accountId = req.user._id

  const potentialOrder = await Order.findOne({ accountId: accountId, active: true })

  if (potentialOrder) return res.status(403).json({ code: 403, description: 'user still has active order, which has to be stopped first' })

  // test if parameters are there
  if (!req.body.routeId) return res.status(400).json({ code: 400, description: 'bad parameters, you need routeId (from route request)' })

  let order, orderId

  try {
    orderId = await OrderHelper.createOrder(accountId, req.body.routeId)
    if (orderId.code) {
      return res.json(orderId)
    }
  } catch (error) {
    console.log(error)
    return res.json(error)
  }

  // Get lean object so that you can edit properties without changing database
  try {
    order = await Order.findById(orderId, '-bonusMultiplier').lean()
  } catch (error) {
    return res.json(error)
  }
  order.id = orderId
  order.route = await Route.findById(order.route)
  console.log('created active order for user ' + accountId + ' with orderId: ' + orderId)
  res.json(order)
})

router.put('/:orderId', async function (req, res) {
  console.log('Put Request to Order : ' + req.query.orderId)
  console.log('Put Request to Order : ' + req.params.orderId)

  const orderId = req.params.orderId || req.query.orderId

  if (!req.query.orderId && !req.params.orderId) res.status(400).json({ code: 400, description: 'No orderId as been sent as param.', reasonPhrase: 'Bad Request' })

  if (req.body.canceled === false || req.body.canceled === 'false') {
    await Order.updateOne({ _id: orderId }, { $set: { canceled: true, vanExitTime: new Date(), active: false } })
  }
  if (req.body.active === false || req.body.active === 'false') {
    await Order.updateOne({ _id: orderId }, { $set: { active: false, vanExitTime: new Date() } })
  }
  const order = await Order.findById(orderId)
  res.json(order)
})

module.exports = router
