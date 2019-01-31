const rpn = require('request-promise-native')
const EnvVariableService = require('./ConfigService.js')
const _ = require('lodash')
const Logger = require('./WinstonLogger').logger

class GoogleMapsHelper {
  static async googleAPICall (start, destination, vb1, vb2, time, vanArrivalDuration) {
    const responses = []
    const key = EnvVariableService.apiKey()

    // This time will be added as a buffer in seconds
    const bufferTimeToEnterOrExitVan = 30

    // First API Call to get to Virtual Bus stop
    const url1 = `https://maps.googleapis.com/maps/api/directions/json?origin=${start.latitude},${start.longitude}&destination=${vb1.location.latitude},${vb1.location.longitude}&key=${key}&mode=walking`

    const responseToVB1 = await rpn({ uri: url1, json: true })
    const durationToVB1 = this.readDurationFromGoogleResponse(responseToVB1)

    responses.push(responseToVB1)

    // Second API Call to get to second Virtual Bus stop

    // Calc times in seconds
    const userArrivalTime = parseInt(new Date(time).getTime() / 1000 + durationToVB1)
    const vanArrivalTime = parseInt(vanArrivalDuration.getTime() / 1000)
    // rideStartTime is the later of the two arrival Times
    const rideStartTime = (userArrivalTime >= vanArrivalTime) ? userArrivalTime + bufferTimeToEnterOrExitVan : vanArrivalTime + bufferTimeToEnterOrExitVan
    Logger.info('rideStartTime: (user + vanarrival+ 30s) ' + new Date(rideStartTime * 1000) + ' -- ' + new Date(userArrivalTime * 1000) + ' -- ' + new Date(vanArrivalTime * 1000) + ' -- ')
    const url2 = `https://maps.googleapis.com/maps/api/directions/json?origin=${vb1.location.latitude},${vb1.location.longitude}&destination=${vb2.location.latitude},${vb2.location.longitude}&key=${key}&mode=driving&departure_time=${rideStartTime}`

    const responseToVB2 = await rpn({ uri: url2, json: true })
    const durationToVB2 = this.readDurationFromGoogleResponse(responseToVB2)
    responses.push(responseToVB2)

    // Third API Call to get to destination
    const lastRoutePartStartTime = rideStartTime + durationToVB2 + bufferTimeToEnterOrExitVan
    const url3 = `https://maps.googleapis.com/maps/api/directions/json?origin=${vb2.location.latitude},${vb2.location.longitude}&destination=${destination.latitude},${destination.longitude}&key=${key}&mode=walking&departure_time=${lastRoutePartStartTime}`

    const response3 = await rpn({ uri: url3, json: true })
    responses.push(response3)
    responses.push(rideStartTime)
    return responses
  }

  static async simpleGoogleRoute (startLocation, destinationLocation) {
    const key = EnvVariableService.apiKey()
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLocation.latitude},${startLocation.longitude}&destination=${destinationLocation.latitude},${destinationLocation.longitude}&key=${key}&mode=driving`
    const answer = await rpn({ uri: url, json: true })
    return answer
  }

  // Returns the route's traveltime in seconds
  static readDurationFromGoogleResponse (googleresponse) {
    return _.get(googleresponse, 'routes.0.legs.0.duration.value')
  }

  // Returns the route's traveltime in seconds starting at the given step
  static readDurationFromGoogleResponseFromStep (googleresponse, step) {
    let steps = _.get(googleresponse, 'routes.0.legs.0.steps')
    let duration = steps.slice(step).reduce((accumulator, currentValue) => accumulator + currentValue.duration.value, 0)
    return duration
  }
}

module.exports = GoogleMapsHelper
