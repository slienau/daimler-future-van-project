const VirtualBusStop = require('../models/VirtualBusStop.js')
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

    await zoo.save()
    await potsdamerPl.save()
  }

  static async getRouteSuggestions (start, destination, startTime) {
    let suggestions = []

    // Get Virtual Bus Stops -- Insert Algorithm for finding optimal VB here
    let vbs
    try {
      vbs = await VirtualBusStop.find({})
    } catch (error) {
      return error
    }
    // Get Google Responses
    const googleResponse = await GoogleMapsHelper.googleAPICall(start, destination, vbs[0], vbs[1], startTime)

    // Calculate Durations from Google Responses
    const vanStartTime = new Date(new Date(startTime).getTime() + GoogleMapsHelper.readDurationFromGoogleResponse(googleResponse[0]) * 1000)
    const vanEndTime = new Date(vanStartTime.getTime() + GoogleMapsHelper.readDurationFromGoogleResponse(googleResponse[1]) * 1000)
    const destinationTime = new Date(vanEndTime.getTime() + GoogleMapsHelper.readDurationFromGoogleResponse(googleResponse[2]) * 1000)

    // Right now give only one suggestions
    suggestions.push({
      startLocation: start,
      destination: destination,
      startStation: vbs[0],
      endStation: vbs[1],
      journeyStartTime: startTime,
      vanStartTime: vanStartTime.toISOString(),
      vanEndTime: vanEndTime.toISOString(),
      destinationTime: destinationTime.toISOString(),
      toStartRoute: googleResponse[0],
      vanRoute: googleResponse[1],
      toDestinationRoute: googleResponse[2]

    })

    return suggestions
  }
}

module.exports = VirtualBusStopHelper
