const winston = require('winston')
const expressWinston = require('express-winston')
const mongoDbEndpoint = process.env.NODE_ENV === 'production' ? 'mongo' : 'localhost'
const MongoDB = require('winston-mongodb').MongoDB

const options = {
  console: {
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true
  },
  mongoInfo: {
    db: `mongodb://${mongoDbEndpoint}:27017/PAS-Backend`,
    level: 'info',
    capped: true,
    json: true
  },
  expressInfo: {
    db: `mongodb://${mongoDbEndpoint}:27017/PAS-Backend`,
    level: 'info',
    capped: true,
    collection: 'expressinfo',
    json: true
  },
  mongoError: {
    db: `mongodb://${mongoDbEndpoint}:27017/PAS-Backend`,
    level: 'error',
    capped: true,
    collection: 'error',
    json: true
  }
}

const expressInfo = new MongoDB(options.expressInfo)
const mongoInfo = new MongoDB(options.mongoInfo)
const mongoError = new MongoDB(options.mongoError)
const conso = new winston.transports.Console(options.console)

const loggerTransports = mongoDbEndpoint === 'localhost' ? [conso] : [mongoInfo, mongoError]
const expressTransports = mongoDbEndpoint === 'localhost' ? [mongoError] : [expressInfo, mongoError]

class WinstonLogger {}

WinstonLogger.logger = winston.createLogger({
  transports: loggerTransports,
  exitOnError: false // do not exit on handled exceptions
})

WinstonLogger.expressLogger = expressWinston.logger({
  transports: expressTransports,
  format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  exitOnError: false // do not exit on handled exceptions
})
module.exports = WinstonLogger
