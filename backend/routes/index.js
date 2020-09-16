const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', async function (req, res) {
  res.json({ message: 'Greetings from PAS TUB 2019 Future Van.' })
})

module.exports = router
