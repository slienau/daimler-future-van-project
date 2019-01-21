const express = require('express')
const router = express.Router()

const ManagementSystem = require('../services/ManagementSystem')

router.get('/', async function (req, res) {

  ManagementSystem.updateVanLocations()
  const vans = ManagementSystem.vans

  res.json(vans)
})

module.exports = router