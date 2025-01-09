const student = require('../model/student')
const teacher = require('../model/teacher')

const Service = require('egg').Service

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
    const { ctx } = this

    const stage = data.stage

    const num = await ctx.service.counter.getNextId('student', stage)

    const students = await ctx.model.Student.create({
      ...data,
      id: stage * 1000 + num
    })
  
    return {
      data: students
    }
  }

  async editCharge(data) {
    const { ctx } = this
    try {
      // 查找id为1的学生并更新charge属性
      const result = await ctx.model.Student.updateOne(
        { id: data.id },  // 查找条件
        { $set: { charge: data.charge } }  // 更新charge属性
      );
      return result
    } catch (err) {
      console.error('更新失败:', err);
      return 'error'
    }
  }

  async chargeStudent(data) {
    const { ctx } = this
    try {
      // 查找id为1的学生并更新charge属性
      const result = await ctx.model.Student.updateOne(
        { id: data.student },  // 查找条件
        { $set: { teacher: data.name, teacherId: data.id } }  // 更新charge属性
      );
      return result
    } catch (err) {
      console.error('更新失败:', err);
      return 'error'
    }
  }

  async delete(id) {
    // 从数据库里查询
    const result = await this.ctx.model.Student.deleteOne({id: id})
  
    return result
  }

  async publicStudent(data) {
    const { ctx } = this
    const { id, isPublic } = data
    try {
      // 查找id为1的学生并更新charge属性
      const result = await ctx.model.Student.updateOne(
        { id: id },  // 查找条件
        { $set: { isPublic: isPublic } }
      );
      return result
    } catch (err) {
      console.error('更新失败:', err);
      return 'error'
    }
  }

  async public() {
    const { ctx } = this
    const students = await ctx.model.Student.find({ isPublic: true })
      .select('id sex subject grade address need period score remark');

    console.log(students)
  
    return students
  }
}

module.exports = StudentService