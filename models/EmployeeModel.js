const mongoose = require('mongoose');
const { type } = require('os');

const EmployeeSchema = new mongoose.Schema({
  name:String,
  salary:Number,
  empType:{
    type:String,
    enum:['pandit','staff','labour']
  },
  attendanceTime:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Attendance'
  }],
  check:{
    type:Number,
    default:0
  },
  personId: { 
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'Active'
  },
  sqlId:String
  }, {
    timestamps: true
  });

const EmployeeModel = mongoose.model('Employee', EmployeeSchema);

module.exports = EmployeeModel;