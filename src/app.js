require('dotenv').config();
const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const { checkOverload } = require('./helpers/check.connect');
const app = express();

//innit middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//init db
require('./dbs/init.mongodb');
// checkOverload();
//innit router
app.use('/', require('./routers'));

//handle error

module.exports = app;
