const express = require('express')
const router = express.Router()
// const _ = require('lodash')

const ManagementSystem = require('../services/ManagementSystem')

router.get('/', async function (req, res) {
  await ManagementSystem.updateVanLocations()
  res.json(ManagementSystem.vans)
})

module.exports = router
