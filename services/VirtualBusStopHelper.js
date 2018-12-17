const VirtualBusStop = require('../models/VirtualBusStop.js')

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
    let vbs

    try {
      vbs = await VirtualBusStop.find({})
    } catch (error) {
      return error
    }

    suggestions.push({
      startLocation: start,
      destination: destination,
      startStation: vbs[0],
      endStation: vbs[1],
      travelTime: 28,
      vanTime: 15,
      vanArrivalTime: 6
    })

    return suggestions
  }
}

module.exports = VirtualBusStopHelper
