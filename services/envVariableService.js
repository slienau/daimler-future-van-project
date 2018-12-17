'use strict'
const yaml = require('js-yaml')
const fs = require('fs')

class EnvVariableService {
  constructor () {
    this.values = yaml.safeLoad(fs.readFileSync(__dirname + '/../environmentVariables.yaml', 'utf8'))
  }

  static apiKey () {
    return this._instance.values.googleAPIkey
  }
  static jwtSecret () {
    return this._instance.values.jwtSecret
  }
}
EnvVariableService._instance = new EnvVariableService()
module.exports = EnvVariableService
