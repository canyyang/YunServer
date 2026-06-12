const Service = require('egg').Service;
const { getCurrentStage, isCurrentStageId } = require('../lib/stage');

class TeacherService extends Service {
  async find(filters = {}, pageNum = 1, pageSize = 10) {
      const { id, name = '', sex = '', subject = [], grade = [], area = [], address = '' } = filters;

      // 构造查询条件
      const query = {};

      if (id !== undefined && id !== null) {
          query.id = Number(id);
      }
      if (name) {
          query.name = { $regex: name, $options: 'i' }; 
      }
      if (sex) {
          query.sex = sex;
      }
      if (subject.length > 0) {
        query.subject = { $in: subject };
      }
      if (grade.length > 0) {
        query.grade = { $in: grade };
      }
      if (area.length > 0) {
        query.area = { $in: area };
      }
      if (address) {
        query.address = { $regex: address, $options: 'i' }; // 模糊匹配
      }
      

      // 计算跳过的记录数
      const skip = (pageNum - 1) * pageSize;

      // 按 _id 降序排序后进行分页查询
      const teachers = await this.ctx.model.Teacher.find(query)
          .sort({ id: -1 }) // 按 _id 降序排序
          .skip(skip)        // 跳过的记录数
          .limit(pageSize);  // 每页的记录数

      // 查询总记录数
      const total = await this.ctx.model.Teacher.countDocuments(query);

      return {
          pageNum,
          pageSize,
          total,
          list: teachers
      };
  }

  async findOne(id) {
    // 从数据库里查询
    const teacher = await this.ctx.model.Teacher.find({id: id})
  
    return teacher[0]
  }

  async add(data) {
    const { ctx } = this;

    const stage = getCurrentStage();

    const num = await ctx.service.counter.getNextId('teacher', stage);

    const teachers = await ctx.model.Teacher.create({
      ...data,
      stage,
      id: stage * 1000 + num,
    });
  
    return {
      data: teachers
    }
  }

  async chargeTeacher(data) {
    const { ctx } = this;
    if (!isCurrentStageId(data.id) || !isCurrentStageId(data.student)) {
      return { forbidden: true };
    }
    try {
      const result = await ctx.model.Teacher.updateOne(
        { id: data.id, stage: getCurrentStage() },
        { $push: { student: data.student } }
      );
      return result
    } catch (err) {
      this.logger.error('[TeacherService] chargeTeacher failed: %s', err.message);
      return 'error'
    }
  }

  async delete(id) {
    if (!isCurrentStageId(id)) {
      return { forbidden: true };
    }
    const result = await this.ctx.model.Teacher.deleteOne({
      id,
      stage: getCurrentStage(),
    });
  
    return result
  }
}

module.exports = TeacherService