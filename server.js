const os = require('os');
const egg = require('egg');

function getWorkers() {
  if (process.env.EGG_WORKERS) {
    const n = Number(process.env.EGG_WORKERS);
    if (Number.isInteger(n) && n > 0) {
      return n;
    }
  }
  // 小服务器默认最多 2 个 worker，可通过环境变量 EGG_WORKERS 覆盖
  return Math.min(os.cpus().length, 2);
}

egg.startCluster({
  workers: getWorkers(),
  baseDir: __dirname,
  port: 7001,
  https: {
    key: '/etc/letsencrypt/live/canyyang.xyz/privkey.pem',
    cert: '/etc/letsencrypt/live/canyyang.xyz/fullchain.pem',
  },
});
