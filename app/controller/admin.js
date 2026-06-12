'use strict';

const Controller = require('egg').Controller;

class AdminController extends Controller {
  async getDataset() {
    const { ctx, service } = this;
    const data = await service.admin.getDataset();
    ctx.body = {
      code: 0,
      message: 'success',
      data,
    };
  }
}

module.exports = AdminController;
