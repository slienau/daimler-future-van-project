const _ = require('lodash')
const createError = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')

const WinstonLogger = require('./services/WinstonLogger')
const mung = require('express-mung')

const indexRouter = require('./routes/index')
const accountRouter = require('./routes/account')
const vbRouter = require('./routes/virtualBusStops')
const orderRouter = require('./routes/orders')
const routesRouter = require('./routes/routes')
const activeOrderRouter = require('./routes/activeOrder')
const vanRouter = require('./routes/vans')

const auth = require('./routes/auth')
const leaderboardRouter = require('./routes/leaderboard')
const passport = require('passport')
require('./services/passport')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

function transformObjectId (obj) {
  if (_.isArray(obj)) return _.map(obj, transformObjectId)
  if (_.hasIn(obj, 'toObject')) obj = obj.toObject()
  if (!_.isPlainObject(obj)) return obj
  delete obj.__v
  if (obj._id) {
    obj.id = obj._id
    delete obj._id
  }
  return _.mapValues(obj, transformObjectId)
}

app.use(mung.json(transformObjectId))

// view engine setup
const jwtlogin = passport.authenticate('jwt', { session: false })

app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')));

app.use(WinstonLogger.expressLogger)

app.use(cors({ origin: 'http://localhost:5000' }))

app.use('/login', auth)
app.use('/', jwtlogin, indexRouter)
app.use('/account', jwtlogin, accountRouter)
app.use('/virtualbusstops', jwtlogin, vbRouter)
app.use('/orders', jwtlogin, orderRouter)
app.use('/routes', jwtlogin, routesRouter)
app.use('/leaderboard', jwtlogin, leaderboardRouter)
app.use('/activeorder', jwtlogin, activeOrderRouter)
app.use('/vans', jwtlogin, vanRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
})

module.exports = app
