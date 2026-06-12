const Service = require('egg').Service;
const {
  getCurrentStage,
  getCurrentStageQuery,
  isCurrentStageId,
} = require('../lib/stage');

class StudentService extends Service {

  async find(filters = {}, pageNum = 1, pageSize = 15) {
    const { id, name = '', charge = '', teacher = '', address = '' } = filters;
    // 构造查询条件
    const query = {};

    if (id !== undefined && id !== null && id !== '') {
        query.id = Number(id);
    }
    if (name) {
        query.name = { $regex: name, $options: 'i' }; 
    }
    if (charge) {
      query.charge = charge;
    }
    if (teacher === '未分配') {
      query.teacher = teacher;
    } else if (teacher === '已分配') {
      query.teacher = { $ne: '未分配' };
    }
    if (address) {
      query.address = { $regex: address, $options: 'i' };
    }

    // 计算跳过的记录数
    const skip = (pageNum - 1) * pageSize;

    // 从数据库里查询带分页的数据
    const students = await this.ctx.model.Student.find(query)
        .sort({ id: -1 })    
        .skip(skip) // 跳过的记录数
        .limit(pageSize); // 每页的记录数

    // 查询总记录数
    const total = await this.ctx.model.Student.countDocuments(query);

    return {
        pageNum,
        pageSize,
        total,
        list: students
    };
  }

  async findOne(id) {
    // 从数据库里查询
    const student = await this.ctx.model.Student.find({id: id})
  
    return student[0]
  }

  async add(data) {
    const { ctx } = this;

    const stage = getCurrentStage();

    const num = await ctx.service.counter.getNextId('student', stage);

    const students = await ctx.model.Student.create({
      ...data,
      stage,
      id: stage * 1000 + num,
    });
  
    return {
      data: students
    }
  }

  async editCharge(data) {
    const { ctx } = this;
    if (!isCurrentStageId(data.id)) {
      return { forbidden: true };
    }
    try {
      const result = await ctx.model.Student.updateOne(
        { id: data.id, stage: getCurrentStage() },
        { $set: { charge: data.charge } }
      );
      return result
    } catch (err) {
      this.logger.error('[StudentService] editCharge failed: %s', err.message);
      return 'error'
    }
  }

  async chargeStudent(data) {
    const { ctx } = this;
    if (!isCurrentStageId(data.student) || !isCurrentStageId(data.id)) {
      return { forbidden: true };
    }
    try {
      const stage = getCurrentStage();
      const result = await ctx.model.Student.updateOne(
        { id: data.student, stage },
        { $set: { teacher: data.name, teacherId: data.id } }
      );
      return result
    } catch (err) {
      this.logger.error('[StudentService] chargeStudent failed: %s', err.message);
      return 'error'
    }
  }

  async delete(id) {
    if (!isCurrentStageId(id)) {
      return { forbidden: true };
    }
    const result = await this.ctx.model.Student.deleteOne({
      id,
      stage: getCurrentStage(),
    });
  
    return result
  }

  async publicStudent(data) {
    const { ctx } = this;
    const { id, isPublic } = data;
    if (!isCurrentStageId(id)) {
      return { forbidden: true };
    }
    try {
      const result = await ctx.model.Student.updateOne(
        { id, stage: getCurrentStage() },
        { $set: { isPublic } }
      );
      return result
    } catch (err) {
      this.logger.error('[StudentService] publicStudent failed: %s', err.message);
      return 'error'
    }
  }

  async public() {
    const { ctx } = this;
    const stage = getCurrentStage();
    const students = await ctx.model.Student.find({
      ...getCurrentStageQuery(stage),
      isPublic: true,
    })
      .select('id sex subject grade address need period score remark')
      .lean();

    return students.filter(item => isCurrentStageId(item.id, stage));
  }
}

module.exports = StudentService