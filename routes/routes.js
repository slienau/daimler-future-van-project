const express = require('express')
const router = express.Router()

const ManagementSystem = require('../services/ManagementSystem')
const VirtualBusStopHelper = require('../services/VirtualBusStopHelper')

// To-do filter for parameters
router.post('/', async function (req, res) {
  console.log('Request to Routes with body: ')
  console.log(req.body)

  if (!req.body.start.latitude || !req.body.destination.longitude || !req.body.start.longitude || !req.body.destination.latitude) res.status(400).json({ code: 400, description: 'Bad body params' })

  const time = req.body.startTime ? new Date(req.body.startTime) : new Date()

  const van = ManagementSystem.requestVan(req.body.start, req.body.destination, time)

  let suggestions = []
  let route
  try {
    route = await VirtualBusStopHelper.getRouteSuggestions(req.body.start, req.body.destination, time, van.timeToVB, van.vanID)
  } catch (error) {
    res.json(error)
  }
  if (route.code) res.status(400).json(route)

  suggestions.push(route)
  res.json(suggestions)
})

module.exports = router
