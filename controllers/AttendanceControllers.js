
const asyncHandler = require('express-async-handler');
const AttendanceModel = require('../models/AttendanceModel');
const EmployeeModel = require('../models/EmployeeModel');
const moment = require('moment');
// const { zonedTimeToUtc } = require('date-fns-tz');

const extractDate = (dateTime) => {
  if (!dateTime) {
    const now = new Date();
    return now.toISOString().split('T')[0]; // Return the date in YYYY-MM-DD format
  }
  return new Date(dateTime).toISOString().split('T')[0]; 
};
// Check-in Controller
const checkin = asyncHandler(async (req, res) => {
  try {
    const { empId, setTime } = req.body;
    const localOffset = 5.5 * 60 * 60 * 1000
    console.log(setTime)
  
    let checkinTime = new Date(setTime); // Parse the check-in time
    const checkinDate = extractDate(checkinTime); // Extract the date without time
    
    // Define the cutoff time as 10:00 AM
    let cutoffTime = new Date(checkinTime);
    cutoffTime.setHours(10, 0, 0, 0); 

    cutoffTime = new Date(cutoffTime.getTime() - localOffset);

    console.log("cutoffTimebefore" , cutoffTime)
    console.log("checkinTime" , checkinTime)

    if (checkinTime < cutoffTime) {
      console.log("cutoffTime" , cutoffTime)
      checkinTime = cutoffTime;
    }
    let attendance = await AttendanceModel.findOne({
      empId,
      date: checkinDate
    });

    if (attendance) {
      attendance.timeLogs.push({ checkIn: checkinTime });
    } else {
      attendance = new AttendanceModel({
        empId: empId,
        date: checkinDate,
        timeLogs: [{ checkIn: checkinTime }],
      });
    }

    const savedAttendance = await attendance.save();

    await EmployeeModel.findByIdAndUpdate(
      empId,
      { $addToSet: { attendanceTime: savedAttendance._id }, check: 1 }, 
      { new: true }
    );

    res.status(200).json({
      message: 'Check-in successful',
      attendance: savedAttendance
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to check in',
      error: err.message
    });
  }
});

const checkout = asyncHandler(async (req, res) => {
  try {
    const { empId, setTime } = req.body;
    const checkoutTime = new Date(setTime);  // Convert setTime to a Date object
    const checkoutDate = extractDate(checkoutTime);  // Format as YYYY-MM-DD

    let attendance = await AttendanceModel.findOne({
      empId,
      date: checkoutDate
    });

    if (attendance) {
      const lastLog = attendance.timeLogs[attendance.timeLogs.length - 1];

      if (lastLog && lastLog.checkIn && !lastLog.checkOut) {
        lastLog.checkOut = checkoutTime;
      } else {
        attendance.timeLogs.push({ checkIn: null, checkOut: checkoutTime });
      }

      let totalHours = 0;
      for (const log of attendance.timeLogs) {
        if (log.checkIn && log.checkOut) {
          const checkInDate = new Date(log.checkIn);
          let checkOutDate = new Date(log.checkOut);

          const sixThirtyPM = new Date(checkInDate);
          sixThirtyPM.setHours(18, 30, 0, 0); // Set to 6:30 PM

          const sevenPM = new Date(checkInDate);
          sevenPM.setHours(19, 0, 0, 0);

          console.log(checkOutDate,sixThirtyPM)

          // If last checkout time is between 6:30 PM and 7:00 PM, use 6:30 PM
          if (checkOutDate >= sixThirtyPM && checkOutDate < sevenPM) {
            checkOutDate = sixThirtyPM;
          }
          
          totalHours += (checkOutDate - checkInDate) / (1000 * 60 * 60); // Convert ms to hours
        }
      }

      attendance.totalHours = totalHours;

    } else {
      attendance = new AttendanceModel({
        empId,
        date: checkoutDate,
        timeLogs: [{ checkIn: null, checkOut: checkoutTime }],
        totalHours: 0  // Initialize as 0 (since there's no check-in time)
      });
      console.log('New attendance created without check-in.');
    }

    const savedAttendance = await attendance.save();
    console.log("Saved attendance:", savedAttendance); // Debugging

    await EmployeeModel.findByIdAndUpdate(
      empId,
      { $addToSet: { attendanceTime: savedAttendance._id }, check: 0 },  // Reset 'check' to 0 on checkout
      { new: true }
    );

    res.status(200).json({
      message: 'Check-out successful',
      attendance: savedAttendance,
      totalHours: attendance.totalHours  // Send back the total hours
    });
  } catch (err) {
    console.error('Error in checkout:', err); // Log error for debugging
    res.status(500).json({
      message: 'Failed to check out',
      error: err.message
    });
  }
});

const todaysPresent = asyncHandler(async (req, res) => {
  try {
    const today = moment().format('YYYY-MM-DD');

    const presentRecords = await AttendanceModel.find({
      date: today, 
      'timeLogs.checkIn': { $exists: true, $ne: null }
    }).populate('empId'); 

    console.log(presentRecords)

    // Map to get only the employee data
    const presentEmployees = presentRecords.map(record => ({
      _id: record.empId._id,
      name: record.empId.name,
      salary: record.empId.salary,
      empType: record.empId.empType,
      status: record.empId.status
    }));

    res.status(200).json({
      message: 'Successfully fetched today\'s present employees',
      data: presentEmployees
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch today\'s present employees',
      error: err.message
    });
  }
});


const todaysAbsent = asyncHandler(async (req, res) => {
  try {
    const today = moment().format('YYYY-MM-DD');

    const presentAttendanceRecords = await AttendanceModel.find({
      date: today,
      'timeLogs.checkIn': { $exists: true, $ne: null } // Check for valid check-ins
    }).populate('empId'); // Populate to get employee details

    const presentEmployeeIds = presentAttendanceRecords.map(record => record.empId._id.toString());

    const allEmployees = await EmployeeModel.find({}).select('_id name salary empType status');

    const absentEmployees = allEmployees.filter(employee => 
      !presentEmployeeIds.includes(employee._id.toString())
    );

    res.status(200).json({
      message: "Absent employees fetched successfully",
      data: absentEmployees,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch today's absent employees",
      error: err.message,
    });
  }
});


const todaysAvailable = asyncHandler(async (req, res) => {
  try {
    const today = moment().format('YYYY-MM-DD');

    const attendanceRecords = await AttendanceModel.find({
      date: today
    }).populate('empId'); // Populate employee details

    const availableEmployees = attendanceRecords.filter(record => {
      const lastLog = record.timeLogs[record.timeLogs.length - 1]; // Get the last time log entry
      return lastLog && lastLog.checkIn && !lastLog.checkOut; // Check if it's a check-in with no check-out
    }).map(record => ({
      _id: record.empId._id,
      name: record.empId.name,
      salary: record.empId.salary,
      empType: record.empId.empType,
      status: record.empId.status
    }));

    res.status(200).json({
      message: "Available employees fetched successfully",
      data: availableEmployees,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch today's available employees",
      error: err.message,
    });
  }
});




module.exports = { checkin,checkout,todaysPresent,todaysAbsent,todaysAvailable };
