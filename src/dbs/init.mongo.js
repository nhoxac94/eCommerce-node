'use strict';

const mongoose = require('mongoose');

const { countConnect } = require('../helpers/check.connection');
const {
  db: { host, name, port },
} = require('../configs/config.mogodb');
const connectStr = `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this.connect();
  }

  // connect
  connect(type = 'mongo') {
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    mongoose
      .connect(connectStr, { maxPoolSize: 50 })
      .then((_) => console.log('Connect MongoDB Success', countConnect()))
      .catch((err) => console.log('Error Connect'));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
