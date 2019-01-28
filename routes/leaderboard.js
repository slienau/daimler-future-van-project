const express = require('express')
const router = express.Router()
const Order = require('../models/Order.js')
const Account = require('../models/Account.js')

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
        }
      ]
    )
      .sort({ loyaltyPoints: -1 }) // sort the scoreboard by loyaltyPoints desc
      .limit(10) // return only the first ten in the leaderboard
    let leaderboardWithUsernames = leaderboard.slice()
    let account
    for (let i = 0; i < leaderboard.length; i++) {
      account = String(leaderboard[i]._id)
      if (String(leaderboard[i]._id)) {
        account = await Account.findById(String(leaderboard[i]._id)).lean()
        delete leaderboardWithUsernames[i]._id
        leaderboardWithUsernames[i].username = account.username
        leaderboardWithUsernames[i].co2savings = Number(leaderboardWithUsernames[i].co2savings.toFixed(2))
      }
    }
    res.json(leaderboardWithUsernames)
  } catch (error) {
    console.log(error)
    res.status(404).json({ error: error, description: 'No items found' })
  }
})

module.exports = router
