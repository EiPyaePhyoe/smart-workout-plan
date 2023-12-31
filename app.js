var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose =require("mongoose");
var session = require("express-session");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require("./routes/admin");
var apiIndexRouter = require("./api/index");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: "Sm@rtW0rkouT@1234",
    resave: false,
    saveUninitialized:true,
  })
);
//local
// mongoose.connect("mongodb://127.0.0.1:27017/smartworkout");
mongoose.connect("mongodb+srv://eipyae:eipyae123@workout.zfyzwtn.mongodb.net/?retryWrites=true&w=majority");
var db= mongoose.connection;
db.on(
  "error",
  console.error.bind(console, "Mongodb connection error at smart workout")
);
app.use(function(req, res, next){
  res.locals.user = req.session.user;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/admin", adminRouter);
app.use("/api", apiIndexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
