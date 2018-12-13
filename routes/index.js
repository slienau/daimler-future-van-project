const express = require('express')
const router = express.Router()

const PastRide = require('../models/PastRides.js')
/* GET home page. */
router.get('/', async function (req, res) {
  res.json({ message: 'It worked, but there is nothing here yet' })
})

// This is outdated, please don't post to the index router
// We want to use this some place else though
router.post('/', async function (req, res) {
  console.log(req.body['id'] + req.body['from'])
  const newRide = new PastRide({
    id: req.body.id,
    from: req.body.from,
    to: req.body.to,
    date: req.body.date,
    time: req.body.time,
    userID: req.body.userID
  })
  await newRide.save()

  res.setHeader('Content-Type', 'application/json')
  PastRide.find()
    .then(items => res.json(items))
    .catch(err => res.status(404).json({ err: err, msg: 'No items found' }))
})

module.exports = router
