// app/service/counter.js
const Service = require('egg').Service;

class CounterService extends Service {
  // 获取自增序列值
  async getNextId(type, stage) {
    const { mongoose } = this.app;
    const Counter = mongoose.model('Counter');
    
    const counter = await Counter.findOneAndUpdate(
      { type: type, stage: stage },
      { $inc: { num: 1 } },
      { new: true, upsert: true }
    );
    
    return counter.num;
  }
}

module.exports = CounterService