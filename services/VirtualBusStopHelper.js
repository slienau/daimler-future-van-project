const VirtualBusStop = require('../models/VirtualBusStop.js');

class VirtualBusStopHelper {

    // Check if any users are there and if not create two static users
    static async setupVBs () {
        let setupNeeded = false;
        await VirtualBusStop.find({},
            function (error, items) {
                if (error || items === null || items.length === 0){
                    setupNeeded = true;
                }
            });
        if(setupNeeded) {
            const zoo = new VirtualBusStop({
                location: {
                    longitude: 52.507304,
                    latitude: 13.330626,
                },
                assesible: true
            });
            const potsdamerPl = new VirtualBusStop({
                location: {
                    longitude: 52.509726,
                    latitude: 13.376962,
                },
                assesible: true
            });

            await zoo.save();
            await potsdamerPl.save();
        }
    }
}

module.exports = VirtualBusStopHelper;