const Controller = require('egg').Controller;

class HomeController extends Controller {
  async login() {
    const { ctx, app } = this;
    const { password } = ctx.request.body
    if (password != app.config.jwt.secret) {
      ctx.body = {
        code: 500,
        msg: '密码错误',
        data: null
      }
      return
    }
    const token = app.jwt.sign({
      username: app.config.jwt.username,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60 * 30)
    }, app.config.jwt.secret);
    
    ctx.body = {
      code: 200,
      msg: '登录成功',
      data: {
        token
      },
    };
  }

  async test() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    // 响应接口
    ctx.body = {
      code: 200,
      message: '获取成功',
      data: {
        ...decode
      }
    }
  }
}

module.exports = HomeController;
