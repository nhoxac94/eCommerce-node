const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const {db : {host , name, port}} = require("../configs/config.mongodb");

const connectStr = `mongodb://${host}:${port}/${name}`;

class DataBase {
  constructor() {
    this.connect();
  }

  connect(type = "mongo") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectStr, {maxPoolSize: 50})
      .then((_) => console.log("Connect DB success!", countConnect()))
      .catch((err) => console.log("Error DB connect", err));
  }

  static getInstance() {
    if (!DataBase.instance) {
      DataBase.instance = new DataBase();
    }

    return DataBase.instance;
  }
}

const instanceMongodb = DataBase.getInstance();

module.exports = instanceMongodb;
