const express = require('express')
const router = express.Router()
const Account = require('../models/Account.js')

router.get('/', function (req, res) {
  res.setHeader('Content-Type', 'application/json')

  Account.findById(req.user._id, '-password')
    .then(item => {
      console.log('Requested Account with id ' + item._id)
      res.json(item)
    })
    .catch(err => res.status(404).json({ err: err, msg: 'No items found' }))
})

module.exports = router
