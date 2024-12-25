const egg = require('egg')

const workers = Number(process.argv[2] || require('os').cpus().length)

egg.startCluster({
  workers,  
  baseDir: __dirname, 
  port: 7001, 
  https: {
   key: '/etc/letsencrypt/live/canyyang.xyz/privkey.pem', // https 证书绝对目录
   cert: '/etc/letsencrypt/live/canyyang.xyz/fullchain.pem', // https 证书绝对目录  ca: path.join(__dirname, './ssl/xxx.crt'), // https 证书绝对目录
  },
})
