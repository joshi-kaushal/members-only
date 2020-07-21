var express = require('express');
const mongoose = require('mongoose')
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')
var flash = require('connect-flash');
const session = require('express-session')
const compression = require('compression');
const helmet = require('helmet');

var indexRouter = require('./routes/index');

const User = require('./models/user')
const Post = require('./models/post')

var app = express();

// MongoDB connection
var dev_db_url = 'mongodb+srv://jk_facebook-clone:quHAYe2Z9RD2Vckj@cluster0.djwid.mongodb.net/private?retryWrites=true&w=majority'
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
mongoose.set('useFindAndModify', false);

// passport library functions
passport.use(
    new LocalStrategy(function (username, password, done) {
        User.findOne({ username }, function (err, user) {
            if (err) return done(err);
            if (!user) {
                return done(null, false, { message: 'No username found' });
            }
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect Password' });
                }
            });
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// View engine setup (handelbars)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, '/public')))

// Using individual middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash())  
app.use(session({ cookie: { maxAge: 60000 }, 
                  secret: 'woot',
                  resave: false, 
                  saveUninitialized: false
                })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(compression()); //Compress all routes
app.use(helmet());

app.use('/', indexRouter);

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
