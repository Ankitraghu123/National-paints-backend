const mongoose = require('mongoose');
const { type } = require('os');

const EmployeeSchema = new mongoose.Schema({
  name:String,
  Dob:Date,
  location:String,
  totalExp:Number,
  previousEmployer:String,
  bankAccountNumber:Number,
  ifscCode:String,
  bankBranch:String,
  mobileNumber:Number,
  alternateNumber:Number,
  City:String,
  pinCode:String,
  currentAddress:String,
  permanentAddress:String,
  email:String,
  panNumber:String,
  maritalStatus:String,
  bloodGroup:String,
  qualification:String,
  fathersName:String,
  salary:Number,
  joininDate:Date,
  // departMent:String,
  empType:{
    type:String,
    enum:['staff','labour','sales','pandit']
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