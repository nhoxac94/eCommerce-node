'use strict';

const mongoose = require('mongoose');
const _SECONDS = 5000;
const os = require('os');
const process = require('process');

const countConnect = () => {
  const numConnection = mongoose.Connection.length;
  console.log(`Number of connection::${numConnection}`);
  return numConnection;
};

//check over load
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.Connection.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Example maximum number of connection based on number of core
    const maxConnections = numCores * 5;

    console.log(`Active connection:: ${numConnection}`);
    console.log(`Memory use:: ${memoryUsage / 1024 / 1024}MB`);

    if (numConnection > maxConnections) {
      console.log('Connection overload detected');
    }
  }, _SECONDS); //monitor every 5s
};

module.exports = {
  countConnect,
  checkOverload,
};
