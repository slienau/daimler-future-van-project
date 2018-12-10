var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var accountsRouter = require('./routes/accounts');
var accountRouter = require('./routes/account');
const auth = require('./services/auth');
const passport = require('passport');
require('./passport');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// view engine setup
const jwtlogin = passport.authenticate('jwt', {session: false});

app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/login', auth);
app.use('/',jwtlogin, indexRouter);
app.use('/accounts', jwtlogin, accountsRouter);
app.use('/account', jwtlogin, accountRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
