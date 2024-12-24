module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const StudentSchema = new Schema({
    id: {
      type: Number,
      require: true
    },
    charge: {
      type: String,
      require: true,
      default: '等待分院'
    },
    state: {
      type: String
    },
    teacherId: {
      type: Number,
      default: 0 
    },
    teacher: {
      type: String,
      default: '未分配'
    },
    time: {
      type: Number,
      require: true
    },
    stage: {
      type: Number,
      require: true
    },
    name: {
      type: String,
      require: true
    },
    sex: {
      type: String,
      require: true,
    },
    subject: {
      type: String,
    },
    grade: {
      type: String,
      require
    },
    school: {
      type: String,
      require: true
    },
    address: {
      type: String,
      require: true
    },
    phone: {
      type: String,
      default: ''
    },
    qq: {
      type: String,
      default: ''
    },
    wechat: {
      type: String,
      default: ''
    },
    need: {
      type: String,
      require: true
    },
    period: {
      type: String,
      require: true
    },
    score: {
      type: String
    },
    remark: {
      type: String,
      default: '无'
    },
    yunhan: {
      type: Boolean,
      require: true
    },
    source: {
      type: String,
      require: true
    },
    isPublic: {
      type: Boolean,
      default: false
    }
  })

  const Student = mongoose.model('Students', StudentSchema)

  return Student
}