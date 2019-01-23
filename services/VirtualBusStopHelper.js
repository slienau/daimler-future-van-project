const geolib = require('geolib')

const VirtualBusStop = require('../models/VirtualBusStop.js')
const Route = require('../models/Route.js')
const GoogleMapsHelper = require('../services/GoogleMapsHelper.js')

class VirtualBusStopHelper {
  // Check if any users are there and if not create two static users

  static async setupVBs () {
    const vbs = await VirtualBusStop.find({})
    if (vbs !== null && vbs.length !== 0) return

    const zoo = new VirtualBusStop({
      location: {
        latitude: 52.507304,
        longitude: 13.330626
      },
      name: 'Zoo - Hardenbergstraße 31',
      accessible: true
    })
    const potsdamerPl = new VirtualBusStop({
      location: {
        latitude: 52.509726,
        longitude: 13.376962
      },
      name: 'Potsdamer Platz 25',
      accessible: true
    })
    const hbf = new VirtualBusStop({
      location: {
        latitude: 52.524158,
        longitude: 13.369407
      },
      name: 'Hauptbahnhof - Washingtonplatz 1 ',
      accessible: true
    })
    const alex = new VirtualBusStop({
      location: {
        latitude: 52.523020,
        longitude: 13.411019
      },
      name: 'Alexanderplatz',
      accessible: true
    })
    const kotti = new VirtualBusStop({
      location: {
        latitude: 52.499044,
        longitude: 13.417085
      },
      name: 'Kottbusser Tor - Skalitzer Str. 139',
      accessible: true
    })

    await zoo.save()
    await potsdamerPl.save()
    await hbf.save()
    await alex.save()
    await kotti.save()
  }

  // get Suggestions for Journey
  static async getRouteSuggestions (start, startVB, destinationVB, destination, startTime, vanArrivalTime, vanID) {
    // Abort if the two Virtual Busstops are the same
    if (startVB._id === destinationVB._id) return { code: 404, message: 'The virtual busstop that is closest to your starting locations is the same as the one closest to your destination location. Hence, it does not make sense for you to use this service' }

    // Get Google Responses
    const googleResponse = await GoogleMapsHelper.googleAPICall(start, destination, startVB, destinationVB, startTime, vanArrivalTime)

    // Calculate Durations from Google Responses
    const vanStartTime = new Date(googleResponse[3] * 1000)
    const vanEndTime = new Date(vanStartTime.getTime() + GoogleMapsHelper.readDurationFromGoogleResponse(googleResponse[1]) * 1000)
    const destinationTime = new Date(vanEndTime.getTime() + GoogleMapsHelper.readDurationFromGoogleResponse(googleResponse[2]) * 1000)

    const routeObject = {
      startLocation: start,
      destination: destination,
      startStation: startVB,
      endStation: destinationVB,
      journeyStartTime: startTime,
      vanStartTime: vanStartTime,
      vanEndTime: vanEndTime,
      destinationTime: destinationTime,
      toStartRoute: googleResponse[0],
      vanRoute: googleResponse[1],
      toDestinationRoute: googleResponse[2],
      vanId: vanID,
      validUntil: new Date(Date.now() + (1000 * 60))
    }

    // Right now give only one suggestion
    const newRoute = new Route(routeObject)
    const dbRoute = await newRoute.save()

    routeObject.id = dbRoute._id

    console.log('Created route with id: ' + dbRoute._id)

    return routeObject
  }

  // Returns the Virtual Busstop that is closest to the reference
  static async getClosestVB (reference) {
    if (!reference.latitude || !reference.longitude) throw new Error('Cannot calculate distances - bad location parameters')

    let vbs = []
    try {
      vbs = await VirtualBusStop.find({})
    } catch (error) { return error }

    // Calculate distances of all Virtual Busstops from the reference
    const distances = []

    try {
      for (const i in vbs) {
        const distance = geolib.getDistance({ latitude: vbs[i].location.latitude, longitude: vbs[i].location.longitude }, reference)
        distances.push(distance)
      }
    } catch (err) { console.log(err) }

    // Get the virtual busstop that is closest
    const min = Math.min(...distances)
    return vbs[distances.indexOf(min)]
  }
}
module.exports = VirtualBusStopHelper
