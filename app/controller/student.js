const Controller = require('egg').Controller

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
    const { ctx, service } = this

    const data = ctx.request.body

    for (let i = 0; i < data.need.length; i++) {
      const Students = await service.student.add({
        ...data,
        need: data.need[i]
      })
    }

    

    ctx.body = {
      code: 200,
      message: 'success'
    }
  }

  async editCharge() {
    const { ctx, service} = this // 从this获取service

    const data = ctx.request.body

    const students = await service.student.editCharge(data)

    ctx.body = {
        code: 200,
        message: 'success',
        data: students
    }
  }

  async chargeStudent() {
    const { ctx, service } = this

    const data = ctx.request.body

    await service.student.chargeStudent(data)

    await service.teacher.chargeTeacher(data)

    ctx.body = {
        code: 200,
        message: 'success',
    }
  }

  async deleteStudent() {
    const { ctx, service } = this

    const { id } = ctx.query

    const result = await service.student.delete(id) 

    ctx.body = {
        code: 200,
        message: 'success',
        data: result
    }
  }

  async setPublicStudent() {
    const { ctx, service} = this

    const data = ctx.request.body

    const result = await service.student.publicStudent(data)

    ctx.body = {
        code: 200,
        message: 'success',
        data: result
    }
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