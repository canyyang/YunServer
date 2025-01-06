const Controller = require('egg').Controller

class TeachersController extends Controller {
  async getTeachers() {
    const { ctx, service} = this // 从this获取service

    const { filter, pageNum } = ctx.request.body

    const teachers = await service.teacher.find(filterm, pageNum) 

    ctx.body = {
        code: 0,
        message: 'success',
        data: teachers
    }
  }

  async getTeacherDetail() {
    const { ctx, service } = this

    const { id } = ctx.query

    const teacher = await service.teacher.findOne(id) 

    ctx.body = {
        code: 200,
        message: 'success',
        data: teacher
    }
  }

  async addTeacher() {
    const { ctx, service } = this

    const data = ctx.request.body

    const teachers = await service.teacher.add(data)

    ctx.body = {
      code: 0,
      message: 'success',
      data: teachers
    }
  }

  async deleteTeacher() {
    const { ctx, service } = this

    const { id } = ctx.query

    const result = await service.teacher.delete(id)

    ctx.body = {
      code: 200,
      message: 'success',
      data: result
    }
  }
}

module.exports = TeachersController;