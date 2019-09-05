const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const indexRouter = require('./routes/index');
const users = require('./routes/users');
const invite = require('./routes/invite');
const friends = require('./routes/friends');
const privateChats = require('./routes/private-chats');
const groupChats = require('./routes/group-chat');

const app = express();

//Set cors settings
const corsOptions = {
   origin: '*',
   methods: ['ACCEPT', 'GET', 'POST', 'DELETE', 'OPTIONS'],
   allowedHeaders: [
      'Accept',
      'Content-Type',
      'Authorization',
      'X-Requested-With',
   ],
   maxAge: 3600,
}
app.use(cors(corsOptions))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({
   type: ['application/json', 'text/plain'],
}));
app.use(express.urlencoded({
   extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', users);
app.use('/invite', invite);
app.use('/friends', friends);
app.use('/chats', privateChats);
app.use('/groupChat', groupChats);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
   next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get('env') === 'development' ? err : {};

   // render the error page
   res.status(err.status || 500);
   res.render('error');
});

module.exports = app;