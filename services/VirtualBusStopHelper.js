const VirtualBusStop = require('../models/VirtualBusStop.js')

class VirtualBusStopHelper {
  // Check if any users are there and if not create two static users
  static async setupVBs () {
    let setupNeeded = false
    await VirtualBusStop.find({},
      function (error, items) {
        if (error || items === null || items.length === 0) {
          setupNeeded = true
        }
      })
    if (setupNeeded) {
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
}

module.exports = VirtualBusStopHelper
