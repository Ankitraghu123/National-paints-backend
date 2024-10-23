const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
  month: {
    type: Date,
    required: true,
    // unique: true
  },
  amount:{
    type:Number
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  leave:{
    type:Number,
    default:1
  },
  isSalaryApproved:{
    type:Boolean,
    default:false
  },
  advance:{
    type:Boolean,
    default:false
  },
  loanAmount:{
    type:Number
  }
}, {
  timestamps: true
});

const SalaryModel = mongoose.model('Salary', SalarySchema);

module.exports = SalaryModel;
