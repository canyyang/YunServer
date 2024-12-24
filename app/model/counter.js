module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const counterSchema = new Schema({
    type: String,  // 用于标识自增字段的名称
    stage: Number,
    num: { type: Number, default: 0 },
  });
  
  const Counter = mongoose.model('Counter', counterSchema);
  
  return Counter
}