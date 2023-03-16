const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();

// init middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// init db
require('./dbs/init.mongo');
const { checkOverload } = require('./helpers/check.connection');
// checkOverload();

// init router
app.use('', require('./routers'));

// handle error

module.exports = app;
