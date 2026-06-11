module.exports = secret => {
  return async function jwtErr(ctx, next) {
    const token = ctx.request.header.authorization;

    if (token != 'null' && token) {
      try {
        const decode = ctx.app.jwt.verify(token, secret);
        if (decode.username !== 'yunhan') {
          ctx.status = 200;
          ctx.body = {
            msg: 'token无效',
            code: 401,
          };
          return;
        }
        await next();
      } catch (err) {
        ctx.logger.warn('[jwtErr] token verify failed: %s', err.message);
        ctx.status = 200;
        ctx.body = {
          msg: 'token已过期',
          code: 401,
        };
        return;
      }
    }

    ctx.status = 200;
    ctx.body = {
      msg: 'token不存在',
      code: 401,
    };
  };
};
