const express = require('express')
const router = express.Router()
const Order = require('../models/Order.js')
const VirtualBusStop = require('../models/VirtualBusStop.js')

router.get('/', async function (req, res) {
    const orders = await Order.find({'accountID':req.user._id});
    const ordersObject = JSON.parse(JSON.stringify(orders))

    try {
        for(ord in ordersObject){
            const vb1 = await VirtualBusStop.findById(ordersObject[ord].virtualBusStopStart)
            const vb2 = await VirtualBusStop.findById(ordersObject[ord].virtualBusStopEnd)
            ordersObject[ord].virtualBusStopStart = vb1
            ordersObject[ord].virtualBusStopEnd = vb2
        }
    }
    catch(error){
        console.log(error)
    }


    res.json(ordersObject);
})

module.exports = router