var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { engine } = require('express-handlebars');
var { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
var Handlebars = require('handlebars');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Set up Handlebars
app.engine('hbs', engine({
  extname: '.hbs', 
  defaultLayout: '_main',
  partialsDir: path.join(__dirname, 'views/partials'),
  layoutsDir: path.join(__dirname, 'views/layouts'),
  handlebars: allowInsecurePrototypeAccess(Handlebars), // Enable prototype access
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
