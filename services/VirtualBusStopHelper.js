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
      accessible: true
    })
    const potsdamerPl = new VirtualBusStop({
      location: {
        latitude: 52.509726,
        longitude: 13.376962
      },
      accessible: true
    })

    await zoo.save()
    await potsdamerPl.save()
  }
}

module.exports = VirtualBusStopHelper
