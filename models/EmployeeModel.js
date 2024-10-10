const mongoose = require('mongoose');
const { type } = require('os');

const EmployeeSchema = new mongoose.Schema({
  name:String,
  attendanceTime:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Attendance'
  }],
  check:{
    type:Number,
    default:0
  }
  }, {
    timestamps: true
  });

const EmployeeModel = mongoose.model('Employee', EmployeeSchema);

module.exports = EmployeeModel;