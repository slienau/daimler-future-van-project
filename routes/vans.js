const express = require('express')
const router = express.Router()
const _ = require('lodash')

const ManagementSystem = require('../services/ManagementSystem')

function getVans () {
  let vans = ManagementSystem.vans.map(van => {
    let uniqueStops = _.uniqWith(van.nextStops, (stop1, stop2) => stop1.vb._id.equals(stop2.vb._id)).map(stop => stop.vb)
    return {
      ...van,
      nextStops: uniqueStops
    }
  })
  return vans
}

router.get('/', async function (req, res) {
  await ManagementSystem.updateVanLocations()
  res.json(getVans())
})

module.exports = router
