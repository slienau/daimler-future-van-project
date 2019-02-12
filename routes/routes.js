const express = require('express')
const router = express.Router()
const Logger = require('../services/WinstonLogger').logger
const GoogleMapsHelper = require('../services/GoogleMapsHelper')
const Route = require('../models/Route.js')

const ManagementSystem = require('../services/ManagementSystem')
const VirtualBusStopHelper = require('../services/VirtualBusStopHelper')

// To-do filter for parameters
router.post('/', async function (req, res) {
  Logger.info('Request to Routes with body: ')
  Logger.info(req.body)

  if (!req.body.start.latitude || !req.body.destination.longitude || !req.body.start.longitude || !req.body.destination.latitude) return res.status(400).json({ code: 400, message: 'Bad body params' })

  // Find the virtual bus stops that a closest to the passenger
  const startVB = await VirtualBusStopHelper.getClosestVB(req.body.start)
  const destinationVB = await VirtualBusStopHelper.getClosestVB(req.body.destination)

  const passengerCount = req.body.passengers ? req.body.passengers : 1

  // Abort if the two Virtual Busstops are the same
  if (startVB._id.equals(destinationVB._id)) return res.status(404).json({ code: 404, message: 'The virtual busstop that is closest to your starting locations is the same as the one closest to your destination location. Hence, it does not make sense for you to use this service' })

  // Walking Route from the users location to the first VBS, duration is in seconds
  const walkingRouteToStartVB = await GoogleMapsHelper.simpleGoogleRoute(req.body.start, startVB.location, 'walking')
  const walkingTimeToStartVB = GoogleMapsHelper.readDurationFromGoogleResponse(walkingRouteToStartVB)

  // request a Van a find out how long it takes to the VB
  const van = await ManagementSystem.requestVan(req.body.start, startVB, destinationVB, req.body.destination, walkingTimeToStartVB, passengerCount)

  // If there is an error send error message
  if (van.code) {
    Logger.error(van)
    return res.status(van.code).json(van)
  }
  // Frontend cannot handle vanRoute Arrays yet so if there is multiple routes due to pooling just give the frontend the simple route connection instead
  const vanRoute = (van.userVanRoute.length > 1) ? await GoogleMapsHelper.simpleGoogleRoute(startVB.location, destinationVB.location) : van.userVanRoute[0]

  // Route from second VBS to the users destination, duration is in seconds
  const fromVB2ToDestRoute = await GoogleMapsHelper.simpleGoogleRoute(destinationVB.location, req.body.destination, 'walking')
  const fromVB2ToDestRouteDur = GoogleMapsHelper.readDurationFromGoogleResponse(fromVB2ToDestRoute)

  let suggestions = []

  const routeObject = {
    userStartLocation: req.body.start,
    userDestinationLocation: req.body.destination,
    vanStartVBS: startVB,
    vanEndVBS: destinationVB,
    vanETAatStartVBS: van.rideStartTime,
    vanETAatEndVBS: van.userArrivalAtDestVBS,
    userETAatUserDestinationLocation: new Date(van.userArrivalAtDestVBS.getTime() + 30 * 1000 + fromVB2ToDestRouteDur * 1000),
    latestArrivalTimeAtUserDestinationLocation: new Date(van.userArrivalAtDestVBS.getTime() + 30 * 1000 + fromVB2ToDestRouteDur * 1000 + 60 * 10 * 1000),
    toStartRoute: walkingRouteToStartVB,
    vanRoute: vanRoute,
    toDestinationRoute: fromVB2ToDestRoute,
    vanId: van.vanId,
    validUntil: new Date(Date.now() + (1000 * 60)),
    passengerCount: passengerCount
  }

  // Right now give only one suggestion
  const newRoute = new Route(routeObject)
  const dbRoute = await newRoute.save()
  /*

  try {
    route = await VirtualBusStopHelper.getRouteSuggestions(req.body.start, startVB, destinationVB, req.body.destination, time, van.nextStopTime, van.vanId, passengerCount)
  } catch (error) {
    Logger.error(error)
    res.json(error)
  }
  if (route.code) res.status(400).json(route)
  */
  suggestions.push(dbRoute)
  res.json(suggestions)
})

module.exports = router
