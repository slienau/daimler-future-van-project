const express = require('express')
const router = express.Router()
const Account = require('../models/Account.js')

router.get('/:accountId', function (req, res) {
  res.setHeader('Content-Type', 'application/json')

  Account.find({ '_id': req.params.accountId }, '-password')
    .then(item => {
      res.json(item)
    })
    .catch(err => res.status(404).json({ err: err, msg: 'No items found' }))
})

module.exports = router
