const { extractToken } = require('../lib/jwtUtil');

module.exports = secret => {
  return async function jwtErr(ctx, next) {
    const token = extractToken(ctx.request.header.authorization);

    if (!token) {
      ctx.status = 200;
      ctx.body = {
        msg: 'token不存在',
        code: 401,
      };
      return;
    }

    try {
      const decode = ctx.app.jwt.verify(token, secret);
      if (decode.username !== ctx.app.config.jwt.username) {
        ctx.status = 200;
        ctx.body = {
          msg: 'token无效',
          code: 401,
        };
        return;
      }
      await next();
    } catch (err) {
      // 过期 token 在登录页/切换账号时属于预期情况，避免反复打 warn 日志
      if (err.name === 'TokenExpiredError') {
        ctx.status = 200;
        ctx.body = {
          msg: 'token已过期',
          code: 401,
        };
        return;
      }

      ctx.logger.warn('[jwtErr] token verify failed: %s', err.message);
      ctx.status = 200;
      ctx.body = {
        msg: 'token无效',
        code: 401,
      };
    }
  };
};
