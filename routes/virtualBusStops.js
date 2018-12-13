const express = require('express')
const router = express.Router()
const VirtualBusStop = require('../models/VirtualBusStop.js')

// To-do filter for parameters
router.get('/', function(req, res){
    console.log("Request to Virtual bus stops with parameters: ")
    console.log(req.query)
    res.setHeader('Content-Type', 'application/json')
    VirtualBusStop.find({}, function (error, items) {
        res.json(items)
    })
})



module.exports = router