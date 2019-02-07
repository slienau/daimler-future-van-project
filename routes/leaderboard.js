const express = require('express')
const router = express.Router()
const Order = require('../models/Order.js')
const Account = require('../models/Account.js')
const Logger = require('../services/WinstonLogger').logger
const AccountHelper = require('../services/AccountHelper.js')

router.get('/', async function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  let leaderboard
  try {
    leaderboard = await Order.aggregate(
      [
        {
          $match:
            {
              'canceled': false
            }
        },
        {
          $group:
            {
              _id: '$accountId',
              loyaltyPoints: { $sum: '$loyaltyPoints' },
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
      leaderboardWithUsernames[i].loyaltyPoints = Number(leaderboardWithUsernames[i].loyaltyPoints.toFixed(0))
      if (String(leaderboard[i]._id)) {
        account = await Account.findById(String(leaderboard[i]._id)).lean()
        delete leaderboardWithUsernames[i]._id
        leaderboardWithUsernames[i].username = account.username
        leaderboardWithUsernames[i].co2savings = Number(leaderboardWithUsernames[i].co2savings.toFixed(2))
        // Calculate the status of an account based on the loyalty points
        leaderboardWithUsernames[i].status = AccountHelper.status(leaderboard[i].loyaltyPoints)
      }
    }
    res.json(leaderboardWithUsernames)
  } catch (error) {
    Logger.error(error)
    res.status(404).json({ error: error, description: 'No items found' })
  }
})

module.exports = router
