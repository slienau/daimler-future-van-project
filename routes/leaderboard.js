const express = require('express')
const router = express.Router()
const Order = require('../models/Order.js')

router.get('/', async function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  let leaderboard
  try {
    leaderboard = await Order.aggregate(
      [
        {
          $group:
            {
              _id: '$accountId',
              loyaltyPoints: { $sum: { $multiply: ['$distance', '$bonusMultiplier'] } },
              co2savings: { $sum: '$co2savings' }
            }
        },
        {
          $project: {
            _id: 0
          }
        }
      ]
    )
      .sort({ loyaltyPoints: -1 }) // sort the scoreboard by loyaltyPoints desc
      .limit(10) // return only the first ten in the leaderboard
    res.json(leaderboard)
  } catch (error) {
    res.status(404).json({ error: error, description: 'No items found' })
  }
})

module.exports = router
