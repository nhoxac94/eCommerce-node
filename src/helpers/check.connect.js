const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const _SECOND = 5000;

const countConnect = () => {
  const numConnection = mongoose.connect.length;
  console.log(`Number of connection::${numConnection}`);
};

// check overload
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCore = os.cpus().length;
    const memoryUse = process.memoryUsage().rss;

    // Example maximum number of connections based on numbers of core
    const maxConnection = numCore * 5;

    console.log(`Active connection::${numConnection}`);
    console.log(`Memory usage:: ${memoryUse / 1024 / 1024}MB`);

    if (numConnection > maxConnection) {
      console.log('Connection overload!!!');
    }
  }, _SECOND); //Monitor every 5 second
};

module.exports = {
  countConnect,
  checkOverload,
};
