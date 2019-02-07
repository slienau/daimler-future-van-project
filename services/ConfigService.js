const yaml = require('js-yaml')
const fs = require('fs')

class ConfigService {
  constructor () {
    this.values = yaml.safeLoad(fs.readFileSync('./config.yaml', 'utf8'))
  }

  static apiKey () {
    return this._instance.values.googleAPIkey
  }
  static jwtSecret () {
    return this._instance.values.jwtSecret
  }
  static vanStartLocations () {
    return this._instance.values.vanStartLocations
  }
  static numberOfSeats () {
    return this._instance.values.numberOfSeats
  }
  static numberOfVans () {
    return this._instance.values.numberOfVans
  }
  static inactiveTimeToReset () {
    return this._instance.values.inactiveTimeToReset
  }
}
ConfigService._instance = new ConfigService()
module.exports = ConfigService
