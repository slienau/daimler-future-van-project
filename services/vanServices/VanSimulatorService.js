const VanHandlerService = require('./VanHandlerService')
const Route = require('../../models/Route.js')
const Order = require('../../models/Order.js')
const geolib = require('geolib')
const _ = require('lodash')
const Logger = require('../WinstonLogger').logger

const tenMinutes = 1 * 60 * 1000

class VanSimulatorService {
  static async updateVanLocations (vans) {
    const currentTime = new Date()
    let latDif, longDif, timeFraction
    // Iterate through all vans
    for (let van of vans) {
      // check if potential is older than 10 minutes
      if (van.potentialRoute.length > 0 && van.potentialRouteTime.getTime() + 60 * 1000 < currentTime.getTime()) {
        Logger.info('Deleting old potential route')
        van.potentialRoute = []
        van.potentialStops = []
        van.potentialCutOffStep = null
        van.potentialRouteTime = null
      }

      // Reset van if if waiting for more than 10 minutes
      if (van.waiting && van.lastStepTime.getTime() + tenMinutes < currentTime.getTime()) {
        await this.checkForInactiveOrders(van)
        continue
      }

      // If van does not have a route or is waiting just contiunue with next van
      if (van.nextRoutes.length === 0 || van.waiting) {
        continue
      }

      // This happens if van has aroute and has not reached the next bus Stop yet
      // This updates the step location
      const steps = _.get(van, 'nextRoutes.0.routes.0.legs.0.steps', [])
      Logger.info('##### UPDATE LOCATIONS #####')
      Logger.info('next stops: ' + van.nextStops.length)
      Logger.info('number steps: ' + steps.length)
      Logger.info('currentStep: ' + van.currentStep)

      // timePassed is the the time that has passed since the lastStepTime
      const timePassed = ((currentTime.getTime() - van.lastStepTime.getTime()) / 1000)
      let timeCounter = 0
      Logger.info('time passed: ' + timePassed)
      Logger.info('curren step duration: ' + steps[van.currentStep].duration.value)

      // Iterate through all steps ahead of current step & find the one that matches the time that has passed
      for (let step = van.currentStep; step < steps.length; step++) {
        timeCounter += steps[step].duration.value

        if (timeCounter > timePassed) {
          // Calculating the actual location in between the step locations only if there is a next step
          latDif = steps[step].end_location.lat - van.lastStepLocation.latitude
          longDif = steps[step].end_location.lng - van.lastStepLocation.longitude
          timeFraction = timePassed / steps[step].duration.value

          // Updating the actual location
          van.location = {
            latitude: van.lastStepLocation.latitude + latDif * timeFraction,
            longitude: van.lastStepLocation.longitude + longDif * timeFraction
          }

          // Updating step location (usually not changing it unless a step has passed)
          van.lastStepLocation = {
            latitude: steps[step].start_location.lat,
            longitude: steps[step].start_location.lng
          }
          // if algorithm has advanced a step, save the current time as the time of the last step and set the actual location to the step location
          if (step > van.currentStep) {
            const lastStepDurations = steps.slice(van.currentStep, step).reduce((prev, curr) => prev + curr.duration.value, 0)
            van.lastStepTime = new Date(van.lastStepTime.getTime() + lastStepDurations * 1000)
            Logger.info('setting new step')
            van.location = {
              latitude: steps[step].start_location.lat,
              longitude: steps[step].start_location.lng
            }
          }
          van.currentStep = step
          break
        } else if (van.currentStep === steps.length - 1) {
          // van reached last step
          Logger.info('last step reached')
          van.lastStepLocation = {
            latitude: steps[van.currentStep].end_location.lat,
            longitude: steps[van.currentStep].end_location.lng
          }
          van.location = {
            latitude: steps[van.currentStep].end_location.lat,
            longitude: steps[van.currentStep].end_location.lng
          }
          // if algorithm has advanced a step, save the current time as the time of the last step
          van.lastStepTime = currentTime
          van.currentStep = 0
          this.wait(van)
          // van.waiting = true
          // van.waitingAt = van.nextStops[0].vb
          // remove the current driven route (and all succeeding ones with a duration of zero)
          van.nextRoutes.shift()
          van.nextRoutes = _.dropWhile(van.nextRoutes, nextRoute => nextRoute.routes[0].legs[0].duration.value === 0)
        } else if (currentTime.getTime() > van.nextStopTime.getTime() + 10 * 1000) {
          Logger.info('Route time was overdue - set to waiting')
          van.lastStepLocation = {
            latitude: steps[steps.length - 1].end_location.lat,
            longitude: steps[steps.length - 1].end_location.lng
          }
          van.location = {
            latitude: steps[steps.length - 1].end_location.lat,
            longitude: steps[steps.length - 1].end_location.lng
          }
          // if algorithm has advanced a step, save the current time as the time of the last step
          van.lastStepTime = currentTime
          van.currentStep = 0
          this.wait(van)

          // remove the current driven route (and all succeeding ones with a duration of zero)
          van.nextRoutes.shift()
          van.nextRoutes = _.dropWhile(van.nextRoutes, nextRoute => nextRoute.routes[0].legs[0].duration.value === 0)
        }
      }
    }
  }

  static wait (van) {
    let nextVB = van.nextStops[0].vb
    // check if the next stop is close to the current van location (range in meters)
    let range = 20
    let from = { latitude: van.lastStepLocation.latitude, longitude: van.lastStepLocation.longitude }
    let to = { latitude: nextVB.location.latitude, longitude: nextVB.location.longitude }
    let dist = geolib.getDistance(from, to)
    Logger.info('check waiting from ' + from + ' to ' + to + ' dist ' + dist)
    if (dist < range) {
      Logger.info('waiting confirmed')
      van.waiting = true
      van.waitingAt = nextVB
    }
  }

  static async checkForInactiveOrders (van) {
    let orderIds = van.nextStops.filter(stop => stop.vb._id.equals(van.waitingAt._id)).map(stop => stop.orderId)
    const currentTime = new Date()
    let counter = orderIds.length
    for (let oid of orderIds) {
      const order = await Order.findById(oid)
      const route = await Route.findById(order.route).lean()
      // set reference time based on whether passenger has started ride or not
      const referenceTime = order.vanEnterTime ? route.vanETAatEndVBS.getTime() + tenMinutes : route.vanETAatStartVBS.getTime() + tenMinutes
      if (referenceTime < currentTime.getTime()) {
        Logger.info('deactivated Order ' + oid)
        await Order.updateOne({ _id: oid }, { $set: { active: false } })
        await VanHandlerService.cancelRide(van, oid)
        counter--
      }
    }
    if (!counter) {
      VanHandlerService.resetVan(van)
    }
  }
}

module.exports = VanSimulatorService
