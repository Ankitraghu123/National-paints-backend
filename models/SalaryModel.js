const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
  month: {
    type: Date,
    required: true,
    // unique: true
  },
  amount:{
    type:String
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  leave:{
    type:Number,
    default:1
  },
}, {
  timestamps: true
});

const SalaryModel = mongoose.model('Salary', SalarySchema);

module.exports = SalaryModel;
