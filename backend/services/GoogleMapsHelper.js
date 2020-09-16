const rpn = require('request-promise-native')
const EnvVariableService = require('./ConfigService.js')
const _ = require('lodash')

class GoogleMapsHelper {
  static async simpleGoogleRoute (startLocation, destinationLocation, mode = 'driving') {
    const key = EnvVariableService.apiKey()
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLocation.latitude},${startLocation.longitude}&destination=${destinationLocation.latitude},${destinationLocation.longitude}&key=${key}&mode=${mode}`
    const response = await rpn({ uri: url, json: true })
    return response
  }

  // Returns the route's traveltime in seconds
  static readDurationFromGoogleResponse (googleresponse) {
    return _.get(googleresponse, 'routes.0.legs.0.steps', []).reduce((prev, curr) => prev + curr.duration.value, 0)
  }

  // Returns the route's traveltime in seconds starting at the given step
  static readDurationFromGoogleResponseFromStep (googleresponse, step) {
    let steps = _.get(googleresponse, 'routes.0.legs.0.steps')
    return steps.slice(step).reduce((accumulator, currentValue) => accumulator + currentValue.duration.value, 0)
  }
}

module.exports = GoogleMapsHelper
