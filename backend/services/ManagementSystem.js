const VanHandlerService = require('./vanServices/VanHandlerService')
const VanRequestService = require('./vanServices/VanRequestService')
const VanSimulatorService = require('./vanServices/VanSimulatorService')
const ConfigService = require('./ConfigService')
const Logger = require('./WinstonLogger').logger

const numberOfVans = ConfigService.numberOfVans()

class ManagementSystem {
  // Returns the van that will execute the ride
  static async requestVan (start, fromVB, toVB, destination, walkingTime, passengerCount = 1) {
    await this.updateVanLocations()

    // determine best van from all possible vans (the one with the lowest duration)
    const bestVan = await VanRequestService.requestBestVan(start, fromVB, toVB, walkingTime, passengerCount, this.vans)
    if (!bestVan) {
      // error, no van found!
      return { code: 403, message: 'No van currently available please try later' }
    }

    Logger.info('bestVan ' + bestVan.vanId)

    // set potential route (and thus lock the van)
    const vanId = bestVan.vanId
    this.vans[vanId - 1].potentialRoute = bestVan.potentialNewRoute
    this.vans[vanId - 1].potentialCutOffStep = bestVan.potentialCutOffStep
    this.vans[vanId - 1].potentialStops = bestVan.potentialStops

    this.vans[vanId - 1].potentialRouteTime = new Date()
    // const timeToVB = GoogleMapsHelper.readDurationFromGoogleResponse(route)
    const timeToVB = bestVan.toStartVBDuration

    return {
      vanId: vanId,
      nextStopTime: new Date(Date.now() + (timeToVB * 1000)),
      userVanRoute: bestVan.userVanRoute,
      userArrivalAtDestVBS: bestVan.userArrivalAtDestVBS,
      rideStartTime: bestVan.rideStartTime
    }
  }

  // This is called when the users confirms/ places an order
  static async confirmVan (fromVB, toVB, vanId, order, passengerCount = 1) {
    let van = this.vans[vanId - 1]
    let res = await VanHandlerService.confirmVan(fromVB, toVB, van, order, passengerCount)
    return res
  }

  static async startRide (order) {
    let van = this.vans[order.vanId - 1]
    let res = await VanHandlerService.startRide(van, order._id)
    return res
  }

  static async endRide (order) {
    let van = this.vans[order.vanId - 1]
    let res = await VanHandlerService.endRide(van, order._id)
    return res
  }

  static async cancelRide (order) {
    let van = this.vans[order.vanId - 1]
    await VanHandlerService.cancelRide(van, order._id)
  }

  static initializeVans () {
    const vanLocations = ConfigService.vanStartLocations()
    const numberOfSeats = ConfigService.numberOfSeats()

    for (let i = 0; i < this.numberOfVans; i++) {
      this.vans[i] = {
        vanId: i + 1,
        lastStepLocation: {
          latitude: vanLocations[i].location.latitude,
          longitude: vanLocations[i].location.longitude
        },
        location: {
          latitude: vanLocations[i].location.latitude,
          longitude: vanLocations[i].location.longitude
        },
        lastStepTime: null,
        nextStopTime: null,
        nextStops: [],
        nextRoutes: [],
        potentialRoute: [],
        potentialRouteTime: null,
        potentialStops: [],
        potentialCutOffStep: null,
        currentlyPooling: false,
        currentStep: 0,
        waiting: false,
        waitingAt: null,
        passengers: [],
        numberSeats: numberOfSeats
      }
    }
  }

  static resetVan (vanId) {
    let van = this.vans[vanId - 1]
    VanHandlerService.resetVan(van)
  }

  static async updateVanLocations () {
    await VanSimulatorService.updateVanLocations(this.vans)
  }
}

ManagementSystem.vans = []
ManagementSystem.numberOfVans = numberOfVans
module.exports = ManagementSystem
