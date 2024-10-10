const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  empId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: String, // Store date in YYYY-MM-DD format
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
  }
}, {
  timestamps: true
});

const AttendanceModel = mongoose.model('Attendance', AttendanceSchema);

module.exports = AttendanceModel;
