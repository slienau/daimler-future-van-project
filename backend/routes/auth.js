const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const Logger = require('../services/WinstonLogger').logger
const EnvVariableService = require('../services/ConfigService.js')
/* POST login. */
router.get('/', function (req, res) {
  res.send('Please post to this URL to receive Log-In-Token. username and password needs to be included in the body as x-www-form-encoded.')
})
router.post('/', function (req, res) {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        message: 'Wrong username or password',
        code: 401
      })
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        Logger.error(err)
        res.send(err)
      }
      const secret = EnvVariableService.jwtSecret()
      // generate a signed son web token with the contents of user object and return it in the response
      const token = jwt.sign({ id: user._id, username: user.username }, secret, { expiresIn: '14d' })
      Logger.info('User ' + user.username + ' just logged in.')
      return res.json({ userId: user._id, token: token })
    })
  })(req, res)
})

module.exports = router
