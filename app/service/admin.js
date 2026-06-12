'use strict';

const Service = require('egg').Service;
const {
  getCurrentStage,
  getCurrentStageQuery,
  isCurrentStageId,
  stripMongoDoc,
} = require('../lib/stage');

class AdminService extends Service {
  async getDataset() {
    const { ctx } = this;
    const stage = getCurrentStage();
    const query = getCurrentStageQuery(stage);

    const [ students, teachers ] = await Promise.all([
      ctx.model.Student.find(query).sort({ id: -1 }).lean(),
      ctx.model.Teacher.find(query).sort({ id: -1 }).lean(),
    ]);

    return {
      stage,
      updatedAt: Date.now(),
      students: students
        .filter(item => isCurrentStageId(item.id, stage))
        .map(stripMongoDoc),
      teachers: teachers
        .filter(item => isCurrentStageId(item.id, stage))
        .map(stripMongoDoc),
    };
  }
}

module.exports = AdminService;
