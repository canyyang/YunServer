module.exports = {
  apps: [
    {
      name: 'yun-server',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 7001,
        EGG_WORKERS: 1,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 7001,
        EGG_WORKERS: 2,
      },
    },
  ],
  deploy: {
    production: {
      user: 'root',
      host: '120.77.36.205',
      ref: 'origin/main',
      repo: 'git@github.com:canyyang/YunServer.git',
      path: '~/workspace/yun-server',
      'post-deploy': 'git reset --hard && git checkout main && git pull && npm i --production=false && pm2 startOrReload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production',
      },
    },
  },
};
