const createError = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const expressWinston = require('express-winston')
const winston = require('winston') // for transports.Console
const MongoDB = require('winston-mongodb').MongoDB

const indexRouter = require('./routes/index')
const accountsRouter = require('./routes/accounts')
const accountRouter = require('./routes/account')
const vbRouter = require('./routes/virtualBusStops')
const orderRouter = require('./routes/orders')
const routesRouter = require('./routes/routes')
const activeOrderRouter = require('./routes/activeOrder')

const auth = require('./routes/auth')
const leaderboardRouter = require('./routes/leaderboard')
const passport = require('passport')
require('./services/passport')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// view engine setup
const jwtlogin = passport.authenticate('jwt', { session: false })

app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')));

app.use(expressWinston.logger({
  transports: [
    new (winston.transports.MongoDB)({
      db: 'mongodb://mongo:27017/PAS-Backend',
      level: 'info',
      capped: true
    }),
    new (winston.transports.MongoDB)({
      db: 'mongodb://mongo:27017/PAS-Backend',
      level: 'error',
      capped: true,
      collection: 'error'
    })
  ],
  format: winston.format.combine(winston.format.colorize(), winston.format.json())
}))
console.log('using the following log DB:')
console.log(MongoDB)

app.use('/login', auth)
app.use('/', jwtlogin, indexRouter)
app.use('/accounts', jwtlogin, accountsRouter)
app.use('/account', jwtlogin, accountRouter)
app.use('/virtualbusstops', jwtlogin, vbRouter)
app.use('/orders', jwtlogin, orderRouter)
app.use('/routes', jwtlogin, routesRouter)
app.use('/leaderboard', jwtlogin, leaderboardRouter)
app.use('/activeorder', jwtlogin, activeOrderRouter)

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
