const mongoOptions = require('./mongoOptions');

exports.mongoose = {
  client: {
    url: 'mongodb://127.0.0.1:27017/egg-mongo',
    options: mongoOptions,
  },
};

exports.baseUrl = 'https://canyyang.xyz:7001';
