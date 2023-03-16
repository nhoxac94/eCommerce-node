'use strict';

// lv 0

// const config = {
//   app: {
//     port: 4000,
//   },
//   db: {
//     host: 'localhost',
//     port: '5000',
//     name: 'db',
//   },
// };

//lv 1

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 4000,
  },
  db: {
    host: process.env.DEV_APP_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || 'shopDEV',
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3000,
  },
  db: {
    host: process.env.PRO_APP_HOST || 'localhost',
    port: process.env.PRO_DB_PORT || 27017,
    name: process.env.PRO_DB_NAME || 'shopPRO',
  },
};

config = { dev, pro };
const env = process.env.NODE_ENV || 'dev';

module.exports = config[env];