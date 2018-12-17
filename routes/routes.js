const express = require('express')
const router = express.Router()

const VirtualBusStopHelper = require('../services/VirtualBusStopHelper')

// To-do filter for parameters
router.post('/', async function (req, res) {
  console.log('Request to Routes with body: ')
  console.log(req.body)
  res.setHeader('Content-Type', 'application/json')
  if (!req.body.start.latitude || !req.body.destination.longitude || !req.body.start.longitude || !req.body.destination.latitude) res.json({ error: 'Bad body params' })

  const time = req.body.startTime ? Date.parse(req.body.startTime) : new Date()
  let suggestions = []
  try {
    suggestions = await VirtualBusStopHelper.getRouteSuggestions(req.body.start, req.body.destination, time)
  } catch (error) {
    res.json(error)
  }
  res.json(suggestions)
})

module.exports = router
