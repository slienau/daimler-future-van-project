const express = require('express')
const router = express.Router()

const VirtualBusStopHelper = require('../services/VirtualBusStopHelper')

// To-do filter for parameters
router.post('/', async function (req, res) {
  console.log('Request to Routes with body: ')
  console.log(req.body)
  res.setHeader('Content-Type', 'application/json')
  if (!req.body.startLatitude || !req.body.startLongitude || !req.body.destinationLatitude || !req.body.destinationLongitude) res.json({ error: 'Bad body params' })

  const time = req.body.startTime ? Date.parse(req.body.startTime) : new Date()
  let suggestions = []
  try {
    suggestions = await VirtualBusStopHelper.getRouteSuggestions({ latitude: req.body.startLatitude, longitude: req.body.startLongitude }, { latitude: req.body.destinationLatitude, longitude: req.body.destinationLongitude }, time)
  } catch (error) {
    res.json(error)
  }
  res.json(suggestions)
})

module.exports = router
