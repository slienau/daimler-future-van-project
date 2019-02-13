const geolib = require('geolib')

const VirtualBusStop = require('../models/VirtualBusStop.js')
const Route = require('../models/Route.js')
const GoogleMapsHelper = require('../services/GoogleMapsHelper.js')
const Logger = require('./WinstonLogger').logger

class VirtualBusStopHelper {
  // Check if any users are there and if not create two static users

  static async setupVBs () {
    const vbs = await VirtualBusStop.find({})
    if (vbs !== null && vbs.length !== 0) return

    const zoo = new VirtualBusStop({
      location: {
        latitude: 52.507144,
        longitude: 13.330612
      },
      name: 'Bahnhof Zoo',
      accessible: true
    })
    const potsdamerPl = new VirtualBusStop({
      location: {
        latitude: 52.509726,
        longitude: 13.376962
      },
      name: 'Potsdamer Platz',
      accessible: true
    })
    const hbf = new VirtualBusStop({
      location: {
        latitude: 52.526176,
        longitude: 13.368972
      },
      name: 'Hauptbahnhof',
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
      name: 'Kottbusser Tor',
      accessible: true
    })
    const erp = new VirtualBusStop({
      location: {
        latitude: 52.511632,
        longitude: 13.322181
      },
      name: 'Ernst-Reuter-Platz',
      accessible: true
    })
    const kufue = new VirtualBusStop({
      location: {
        latitude: 52.499960,
        longitude: 13.363111
      },
      name: 'Kurfürstenstraße',
      accessible: true
    })
    const tustra = new VirtualBusStop({
      location: {
        latitude: 52.519688,
        longitude: 13.340634
      },
      name: 'Turmstraße',
      accessible: true
    })
    const fried = new VirtualBusStop({
      location: {
        latitude: 52.519671,
        longitude: 13.388097
      },
      name: 'Friedrichstraße',
      accessible: true
    })
    const ostb = new VirtualBusStop({
      location: {
        latitude: 52.510105,
        longitude: 13.433079
      },
      name: 'Ostbahnhof',
      accessible: true
    })
    const rosi = new VirtualBusStop({
      location: {
        latitude: 52.529326,
        longitude: 13.401422
      },
      name: 'Rosenthaler Platz',
      accessible: true
    })
    const natu = new VirtualBusStop({
      location: {
        latitude: 52.529967,
        longitude: 13.380471
      },
      name: 'Naturkundemuseum',
      accessible: true
    })
    const herm = new VirtualBusStop({
      location: {
        latitude: 52.487297,
        longitude: 13.424565
      },
      name: 'Hermannplatz',
      accessible: true
    })
    const charl = new VirtualBusStop({
      location: {
        latitude: 52.505242,
        longitude: 13.301897
      },
      name: 'S-Bahnhof Charlottenburg',
      accessible: true
    })
    const mehr = new VirtualBusStop({
      location: {
        latitude: 52.493413,
        longitude: 13.387769
      },
      name: 'Mehringdamm',
      accessible: true
    })
    const greif = new VirtualBusStop({
      location: {
        latitude: 52.536260,
        longitude: 13.432289
      },
      name: 'Greifswalder Straße',
      accessible: true
    })
    const ftor = new VirtualBusStop({
      location: {
        latitude: 52.516142,
        longitude: 13.453484
      },
      name: 'Frankfurter Tor',
      accessible: true
    })
    const check = new VirtualBusStop({
      location: {
        latitude: 52.507475,
        longitude: 13.390161
      },
      name: 'Checkpoint Charlie',
      accessible: true
    })
    const ebers = new VirtualBusStop({
      location: {
        latitude: 52.540788,
        longitude: 13.411868
      },
      name: 'Eberswalder Straße',
      accessible: true
    })
    const berl = new VirtualBusStop({
      location: {
        latitude: 52.487768,
        longitude: 13.331290
      },
      name: 'Berliner Straße',
      accessible: true
    })

    const tub = new VirtualBusStop({
      location: {
        latitude: 52.512735,
        longitude: 13.326966
      },
      name: 'TU Berlin',
      accessible: true
    })

    await tub.save()
    await ebers.save()
    await berl.save()
    await greif.save()
    await ftor.save()
    await check.save()
    await herm.save()
    await charl.save()
    await mehr.save()
    await rosi.save()
    await natu.save()
    await ostb.save()
    await fried.save()
    await tustra.save()
    await zoo.save()
    await potsdamerPl.save()
    await hbf.save()
    await alex.save()
    await kotti.save()
    await erp.save()
    await kufue.save()
  }

  // get Suggestions for Journey
  static async getRouteSuggestions (start, startVB, destinationVB, destination, startTime, vanArrivalTime, vanID, passengerCount) {
    // Get Google Responses
    const googleResponse = await GoogleMapsHelper.googleAPICall(start, destination, startVB, destinationVB, startTime, vanArrivalTime)

    // Calculate Durations from Google Responses
    const vanStartTime = new Date(googleResponse[3] * 1000)
    const vanEndTime = new Date(vanStartTime.getTime() + GoogleMapsHelper.readDurationFromGoogleResponse(googleResponse[1]) * 1000)
    const destinationTime = new Date(vanEndTime.getTime() + GoogleMapsHelper.readDurationFromGoogleResponse(googleResponse[2]) * 1000)

    const routeObject = {
      userStartLocation: start,
      userDestinationLocation: destination,
      vanStartVBS: startVB,
      vanEndVBS: destinationVB,
      vanETAatStartVBS: vanStartTime,
      vanETAatEndVBS: vanEndTime,
      userETAatUserDestinationLocation: destinationTime,
      toStartRoute: googleResponse[0],
      vanRoute: googleResponse[1],
      toDestinationRoute: googleResponse[2],
      vanId: vanID,
      validUntil: new Date(startTime.getTime() + (1000 * 60)),
      passengerCount: passengerCount
    }

    // Right now give only one suggestion
    const newRoute = new Route(routeObject)
    const dbRoute = await newRoute.save()

    routeObject.id = dbRoute._id

    Logger.info('Created route with id: ' + dbRoute._id)

    return routeObject
  }

  // Returns the Virtual Busstop that is closest to the reference
  static async getClosestVB (reference) {
    let vbs = []
    try {
      vbs = await VirtualBusStop.find({})
    } catch (error) { Logger.error(error) }

    // Calculate distances of all Virtual Busstops from the reference
    const distances = []

    try {
      for (const i in vbs) {
        const distance = geolib.getDistance({ latitude: vbs[i].location.latitude, longitude: vbs[i].location.longitude }, reference)
        distances.push(distance)
      }
    } catch (error) { Logger.error(error) }

    // Get the virtual busstop that is closest
    const min = Math.min(...distances)
    return vbs[distances.indexOf(min)]
  }
}
module.exports = VirtualBusStopHelper
