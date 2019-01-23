const express = require('express')
const router = express.Router()
const _ = require('lodash')

const ManagementSystem = require('../services/ManagementSystem')

router.get('/', async function (req, res) {
  ManagementSystem.updateVanLocations()
  res.json(ManagementSystem.vans.map(v => _.pick(v, ['vanId', 'location'])))
})

module.exports = router
