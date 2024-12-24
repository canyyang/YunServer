const student = require("./student")

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const TeacherSchema = new Schema({
    id: {
      type: Number,
      require: true
    },
    student: {
      type: Array,
      require: true
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
      type: [String],
      require: true
    },
    grade: {
      type: [String],
      require: true
    },
    area: {
      type: [String],
      require: true
    },
    address: {
      type: String,
      require: true
    },
    school: {
      type: String,
      require: true
    },
    phone: {
      type: String
    },
    qq: {
      type: String
    },
    wechat: {
      type: String
    },
    remark: {
      type: String
    },
    expand: {
      type: Boolean,
      require: true
    }
  })

  const Teacher = mongoose.model('Teachers', TeacherSchema)

  return Teacher
}