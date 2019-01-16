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
              bonusPoints: { $sum: { $multiply: ['$distance', '$bonusMultiplier'] } }
            }
        }
      ]
    )
      .sort({ bonusPoints: -1 }) // sort the scoreboard by bonuspoints desc
      .limit(10) // return only the first ten in the leaderboard
    res.json(leaderboard)
  } catch (error) {
    res.status(404).json({ error: error, msg: 'No items found' })
  }
})

module.exports = router
