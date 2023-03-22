'use strict';

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECOND = 10000;
// count Connect
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections::${numConnection}`);
  return numConnection;
};

//check over load

const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // Example maximum number of connection base on number of cores

    const maxConnections = numCores * 5;
    console.log(`Active connection:: ${numConnection}`);
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024}MB`);

    if (numConnection > maxConnections) {
      console.log('Connection overload detected');
    }
  }, _SECOND); //Monitor every 10 second
};

module.exports = {
  countConnect,
  checkOverload,
};
