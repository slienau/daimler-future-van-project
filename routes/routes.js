const express = require('express')
const router = express.Router()

const ManagementSystem = require('../services/ManagementSystem')
const VirtualBusStopHelper = require('../services/VirtualBusStopHelper')

// To-do filter for parameters
router.post('/', async function (req, res) {
  console.log('Request to Routes with body: ')
  console.log(req.body)

  if (!req.body.start.latitude || !req.body.destination.longitude || !req.body.start.longitude || !req.body.destination.latitude) res.status(400).json({ code: 400, description: 'Bad body params' })

  const time = new Date()

  // Find the virtual bus stops that a closest to the passenger
  const startVB = await VirtualBusStopHelper.getClosestVB(req.body.start)
  const destinationVB = await VirtualBusStopHelper.getClosestVB(req.body.destination)

  // request a Van a find out how long it takes to the VB
  const van = await ManagementSystem.requestVan(req.body.start, startVB, destinationVB, req.body.destination, time)

  // If there is an error send error message
  if (van.code) res.json(van)

  let suggestions = []
  let route

  // Get a route for the passenger consisting of three route legs
  try {
    route = await VirtualBusStopHelper.getRouteSuggestions(req.body.start, startVB, destinationVB, req.body.destination, time, van.nextStopTime, van.vanId)
  } catch (error) {
    res.json(error)
  }
  if (route.code) res.status(400).json(route)

  suggestions.push(route)
  res.json(suggestions)
})

module.exports = router
