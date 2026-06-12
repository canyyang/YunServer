const Controller = require('egg').Controller;
const { isValidArea } = require('../lib/areas');
const { rejectUnlessCurrentStage, respondIfForbidden } = require('../lib/stage');

class StudentsController extends Controller {
  async getStudents() {
    const { ctx, service } = this // 从this获取service

    const { filter, pageNum } = ctx.request.body

    const students = await service.student.find(filter, pageNum) 

    ctx.body = {
        code: 200,
        message: 'success',
        data: students
    }
  }

  async getStudentDetail() {
    const { ctx, service } = this

    const { id } = ctx.query

    const student = await service.student.findOne(id) 

    ctx.body = {
        code: 200,
        message: 'success',
        data: student
    }
  }

  async addStudent() {
    const { ctx, service } = this;

    const data = ctx.request.body;

    if (!isValidArea(data.area)) {
      ctx.body = {
        code: 400,
        message: '请选择有效的所在区域',
        data: null,
      };
      return;
    }

    const students = [];

    for (let i = 0; i < data.need.length; i++) {
      const result = await service.student.add({
        ...data,
        need: data.need[i]
      })
      students.push(result.data)
    }

    ctx.body = {
      code: 200,
      message: 'success',
      data: students
    }
  }

  async editCharge() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    if (!rejectUnlessCurrentStage(ctx, data.id)) return;

    const students = await service.student.editCharge(data);
    if (respondIfForbidden(ctx, students)) return;

    ctx.body = {
      code: 200,
      message: 'success',
      data: students,
    };
  }

  async chargeStudent() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    if (!rejectUnlessCurrentStage(ctx, data.student)) return;
    if (!rejectUnlessCurrentStage(ctx, data.id)) return;

    const studentResult = await service.student.chargeStudent(data);
    if (respondIfForbidden(ctx, studentResult)) return;

    const teacherResult = await service.teacher.chargeTeacher(data);
    if (respondIfForbidden(ctx, teacherResult)) return;

    ctx.body = {
      code: 200,
      message: 'success',
    };
  }

  async deleteStudent() {
    const { ctx, service } = this;
    const { id } = ctx.query;
    if (!rejectUnlessCurrentStage(ctx, Number(id))) return;

    const result = await service.student.delete(Number(id));
    if (respondIfForbidden(ctx, result)) return;

    ctx.body = {
      code: 200,
      message: 'success',
      data: result,
    };
  }

  async setPublicStudent() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    if (!rejectUnlessCurrentStage(ctx, data.id)) return;

    const result = await service.student.publicStudent(data);
    if (respondIfForbidden(ctx, result)) return;

    ctx.body = {
      code: 200,
      message: 'success',
      data: result,
    };
  }

  async getPublicStudent() {
    const { ctx, service } = this

    const result = await service.student.public() 

    ctx.body = {
        code: 200,
        message: 'success',
        data: result
    }
  }

}

module.exports = StudentsController;