const express = require('express')
const router = express.Router()
const VirtualBusStop = require('../models/VirtualBusStop.js')
const Logger = require('../services/WinstonLogger').logger

// To-do filter for parameters
router.get('/', function (req, res) {
  Logger.info('Request to Virtual bus stops with parameters: ')
  Logger.info(req.query)
  res.setHeader('Content-Type', 'application/json')
  VirtualBusStop.find({}, function (error, items) {
    if (error) Logger.error(error)
    else res.json(items)
  })
})

module.exports = router
