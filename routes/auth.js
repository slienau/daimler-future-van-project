const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
/* POST login. */
router.get('/', function (req, res) {
  res.send('Please post to this URL to receive Log-In-Token. username and password needs to be included in the body as x-www-form-encoded.')
})
router.post('/', function (req, res) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    console.log(user)
    console.log(info)
    if (err || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user
      })
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err)
      }
      // generate a signed son web token with the contents of user object and return it in the response
      const token = jwt.sign({ id: user._id, username: user.username }, 'pas-secret', { expiresIn: '24h' })

      return res.json({ userId: user._id, token: token })
    })
  })(req, res)
})

module.exports = router
