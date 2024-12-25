exports.mongoose = {
  client: {
    url: 'mongodb://127.0.0.1:27017/egg-mongo',
    options: {
      user: 'admin',         // 用户名
      pass: 'canyyang',       // 密码
      authSource: 'admin',    // 认证数据库，通常是 admin
      useNewUrlParser: true,  // 推荐使用新的 URL 解析器
      useUnifiedTopology: true // 推荐使用新的拓扑结构
    }
  }
}

exports.baseUrl = 'https://0.0.0.0:7001'