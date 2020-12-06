var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var designRouter = require('./routes/designs');
var authRouter = require('./routes/auths');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/designs', designRouter);
app.use('/auths', authRouter);

module.exports = app;
