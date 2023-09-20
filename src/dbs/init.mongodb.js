const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect');
const {
  db: { host, port, name },
} = require('../configs/config.mongodb');
const connectStr = `mongodb://${host}:${port}/${name}`;

mongoose
  .connect(connectStr)
  .then((_) => console.log('Connected Mongodb Success!'))
  .catch((err) => console.log('Error connection!'));

class Database {
  constructor() {
    this.connect();
  }

  // connect
  connect(type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    mongoose
      .connect(connectStr)
      .then((_) => {
        console.log('Connected Mongodb Success!'), countConnect();
      })
      .catch((err) => console.log('Error connection!'));
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
