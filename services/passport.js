const passport = require('passport')
const passportJWT = require('passport-jwt')
const EnvVariableService = require('./ConfigService.js')

const ExtractJWT = passportJWT.ExtractJwt

const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = passportJWT.Strategy

const Account = require('../models/Account.js')

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
},
function (username, password, cb) {
  // Assume there is a DB module providing a global UserModel
  return Account.findOne({ 'username': username, 'password': password })
    .then(user => {
      if (!user) {
        return cb(null, false, { message: 'Incorrect username or password.' })
      }

      return cb(null, user, {
        message: 'Logged In Successfully'
      })
    })
    .catch(err => {
      return cb(err)
    })
}
))
// small
const secret = EnvVariableService.jwtSecret()
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
},
function (jwtPayload, cb) {
  // find the user in db if needed
  return Account.findById(jwtPayload.id)
    .then(user => {
      return cb(null, user)
    })
    .catch(err => {
      return cb(err)
    })
}
))
