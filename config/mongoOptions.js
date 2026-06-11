/** MongoDB 连接公共选项（超时与连接池） */
module.exports = {
  user: 'admin',
  pass: 'canyyang',
  authSource: 'admin',
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  maxIdleTimeMS: 30000,
};
