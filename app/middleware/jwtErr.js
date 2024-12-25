module.exports = (secret) => {
  return async function jwtErr(ctx, next) {
    const token = ctx.request.header.authorization
    let decode
    if (token != 'null' && token) {
      try {
        decode = ctx.app.jwt.verify(token, secret)
        if (decode.username !== 'yunhan') {
          ctx.status = 200
          ctx.body = {
            msg: 'token无效',
            code: 401
          }
        } else {
          console.log(decode)
          await next()
        }     
      } catch(err) {
        console.log('error', err)
        ctx.status = 200
        ctx.body = {
          msg: 'token已过期',
          code: 401,
          err: err
        }
      }
    } else {
      ctx.status = 200
      ctx.body = {
        msg: 'token不存在',
        code: 401
      }
      return
    }
  }
}