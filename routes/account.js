const express = require('express')
const router = express.Router()
const Account = require('../models/Account.js')
const Order = require('../models/Order.js')

router.get('/', async function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  let account, bonusitem, responsebody
  let bonuspoints = 0
  let co2savings = 0
  let distance = 0
  try {
    account = await Account.findById(req.user._id, '-password')
    console.log('Requested Account with id ' + account._id)
    bonusitem = await Order.aggregate([
      {
        $match:
          {
            'accountId': String(req.user._id)
          }
      },
      {
        $group:
          {
            _id: '$accountId',
            bonuspoints: { $sum: { $multiply: ['$distance', '$bonusMultiplier'] } },
            co2savings: { $sum: '$co2savings' },
            distance: { $sum: '$distance' }
          }
      }
    ])
    if (bonusitem.length > 0) {
      bonuspoints = bonusitem[0].bonuspoints
      co2savings = bonusitem[0].co2savings
      distance = bonusitem[0].distance
    }
    bonuspoints = Number(bonuspoints.toFixed(0))
    co2savings = Number(co2savings.toFixed(2))
    responsebody = account.toObject()
    responsebody.bonuspoints = bonuspoints
    responsebody.co2savings = co2savings
    responsebody.distance = distance
    res.json(responsebody)
  } catch (error) {
    res.status(404).json({ error: error, msg: 'No items found' })
  }
})

module.exports = router
