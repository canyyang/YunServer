/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1733731577836_139';

  // add your middleware config here
  config.middleware = [];

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    // cookie跨域配置
    credentials: true
  };

  // Use port directly
  config.port = 7001;  // 配置 Egg.js 使用端口 3001

  // HTTPS 配置
  config.https = {
    key: '/etc/letsencrypt/live/canyyang.xyz/privkey.pem',
    cert: '/etc/letsencrypt/live/canyyang.xyz/fullchain.pem',
  };

  config.listen = {
    host: '0.0.0.0', // 允许来自任何 IP 地址的访问
    port: 7001,
    https: {
      key: '/etc/letsencrypt/live/canyyang.xyz/privkey.pem',
      cert: '/etc/letsencrypt/live/canyyang.xyz/fullchain.pem',
    },
  };

  config.cluster = {
    listen: {
      port: 7001,
      hostname: '0.0.0.0' 
    },
  };

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: [ '*' ], // 配置白名单
  };

  config.jwt = {
    username: 'yunhan',
    secret: 'canyang1212',
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
