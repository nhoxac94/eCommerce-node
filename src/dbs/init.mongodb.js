const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");

const connectStr = `mongodb://localhost:27017/shopDev`;

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
