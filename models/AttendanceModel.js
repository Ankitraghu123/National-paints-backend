const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  empId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'empModel'  // Dynamically reference based on the 'empModel' field
  },
  empModel: {
    type: String,
    // required: true,
    enum: ['UnPaidEmployee', 'Employee']  // The two possible models it can reference
  },
  date: {
    type: String, 
    required: true
  },
  timeLogs: [
    {
      checkIn: {
        type: Date
      },
      checkOut: {
        type: Date
      }
    }
  ],
  totalHours: {
    type: Number, // Store total working hours for the day
    default: 0
  },
  totalSalary:{
    type:Number,
    default:0,
  },
  sqlId:String
}, {
  timestamps: true
});

const AttendanceModel = mongoose.model('Attendance', AttendanceSchema);

module.exports = AttendanceModel;
