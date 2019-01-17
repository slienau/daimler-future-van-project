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
}
ConfigService._instance = new ConfigService()
module.exports = ConfigService
