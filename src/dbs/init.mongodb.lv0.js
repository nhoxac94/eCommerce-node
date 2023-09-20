const mongoose = require('mongoose');

const connectStr = 'mongodb://localhost:27017/shopDev';

mongoose
  .connect(connectStr, { maxPoolSize: 50 })
  .then((_) => console.log('Connected Mongodb Success!'))
  .catch((err) => console.log('Error connection!'));

// dev
if (1 === 0) {
  mongoose.set('debug', true);
  mongoose.set('debug', { color: true });
}

module.exports = mongoose;
