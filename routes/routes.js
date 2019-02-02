const express = require('express')
const router = express.Router()
const Logger = require('../services/WinstonLogger').logger
const GoogleMapsHelper = require('../services/GoogleMapsHelper')

const ManagementSystem = require('../services/ManagementSystem')
const VirtualBusStopHelper = require('../services/VirtualBusStopHelper')

// To-do filter for parameters
router.post('/', async function (req, res) {
  Logger.info('Request to Routes with body: ')
  Logger.info(req.body)

  if (!req.body.start.latitude || !req.body.destination.longitude || !req.body.start.longitude || !req.body.destination.latitude) res.status(400).json({ code: 400, description: 'Bad body params' })

  const time = new Date()

  // Find the virtual bus stops that a closest to the passenger
  const startVB = await VirtualBusStopHelper.getClosestVB(req.body.start)
  const destinationVB = await VirtualBusStopHelper.getClosestVB(req.body.destination)

  // Abort if the two Virtual Busstops are the same
  if (startVB._id.equals(destinationVB._id)) return res.status(403).json({ code: 403, message: 'The virtual busstop that is closest to your starting locations is the same as the one closest to your destination location. Hence, it does not make sense for you to use this service' })

  const walkingRoutToStartVB = await GoogleMapsHelper.simpleGoogleRoute(req.body.start, startVB.location, 'walking')
  const walkingTimeToStartVB = GoogleMapsHelper.readDurationFromGoogleResponse(walkingRoutToStartVB)

  // request a Van a find out how long it takes to the VB
  const van = await ManagementSystem.requestVan(req.body.start, startVB, destinationVB, req.body.destination, walkingTimeToStartVB)

  // If there is an error send error message
  if (van.code) return res.status(403).json(van)

  let suggestions = []
  let route

  // Get a route for the passenger consisting of three route legs
  try {
    route = await VirtualBusStopHelper.getRouteSuggestions(req.body.start, startVB, destinationVB, req.body.destination, time, van.nextStopTime, van.vanId)
  } catch (error) {
    Logger.error(error)
    res.json(error)
  }
  if (route.code) res.status(400).json(route)

  suggestions.push(route)
  res.json(suggestions)
})

module.exports = router
