const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', async function (req, res) {
  res.json({ message: 'It worked, but there is nothing here yet' })
})

module.exports = router
