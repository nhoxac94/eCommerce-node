'use strict';

const mongoose = require('mongoose');

const connectString = `mongodb://localhost:4000/shopDEV`;

mongoose
  .connect(connectString)
  .then((_) => console.log(`Connect Mongodb Success`))
  .catch((err) => console.log('Error Connect'));
