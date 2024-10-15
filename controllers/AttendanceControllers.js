
const asyncHandler = require('express-async-handler');
const AttendanceModel = require('../models/AttendanceModel');
const EmployeeModel = require('../models/EmployeeModel');

// Helper function to extract just the date (YYYY-MM-DD)
const extractDate = (dateTime) => {
  if (!dateTime) {
    // If dateTime is empty, return today's date with the current time
    const now = new Date();
    return now.toISOString().split('T')[0]; // Return the date in YYYY-MM-DD format
  }
  return new Date(dateTime).toISOString().split('T')[0]; // Return formatted date if dateTime is provided
};
// Check-in Controller
const checkin = asyncHandler(async (req, res) => {
  try {
    const { empId, setTime } = req.body;
    // console.log(setTime)
    // console.log(setTime)
    let checkinTime = new Date(setTime); // Parse the check-in time
    const checkinDate = extractDate(checkinTime); // Extract the date without time

    // Define the cutoff time as 10:00 AM
    const cutoffTime = new Date(checkinTime);
    cutoffTime.setHours(10, 0, 0, 0); // Set the time to 10:00 AM for that day

    // If the check-in time is earlier than 10:00 AM, set it to 10:00 AM
    if (checkinTime < cutoffTime) {
      console.log(checkinTime)
      checkinTime = cutoffTime;
    }

    // Find if there's already an attendance entry for this employee on the same date
    let attendance = await AttendanceModel.findOne({
      empId,
      date: checkinDate
    });

    if (attendance) {
      // If the attendance entry exists, add the check-in time to the timeLogs array
      attendance.timeLogs.push({ checkIn: checkinTime });
    } else {
      // If no entry exists, create a new attendance record with check-in time
      attendance = new AttendanceModel({
        empId: empId,
        date: checkinDate,
        timeLogs: [{ checkIn: checkinTime }],
      });
    }

    // Save or update the attendance record
    const savedAttendance = await attendance.save();

    // Update the employee's attendanceTime array
    await EmployeeModel.findByIdAndUpdate(
      empId,
      { $addToSet: { attendanceTime: savedAttendance._id }, check: 1 }, // Using $addToSet to prevent duplicate entries
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

    // Find if there's already an attendance entry for this employee on the same date
    let attendance = await AttendanceModel.findOne({
      empId,
      date: checkoutDate
    });

    if (attendance) {
      // If the attendance entry exists, update the last log
      const lastLog = attendance.timeLogs[attendance.timeLogs.length - 1];

      // Update the last log's checkout time if check-in exists and checkout is missing
      if (lastLog && lastLog.checkIn && !lastLog.checkOut) {
        lastLog.checkOut = checkoutTime;
        // console.log("Updated check-out time:", lastLog.checkOut); // Debugging
      } else {
        // If no matching log, create a new check-out log
        attendance.timeLogs.push({ checkIn: null, checkOut: checkoutTime });
        console.log("New check-out log created.");
      }

      // Recalculate the total working hours
      let totalHours = 0;
      for (const log of attendance.timeLogs) {
        if (log.checkIn && log.checkOut) {
          const checkInDate = new Date(log.checkIn);
          const checkOutDate = new Date(log.checkOut);
          console.log(checkInDate,checkOutDate)
          
          totalHours += (checkOutDate - checkInDate) / (1000 * 60 * 60); // Convert ms to hours
          console.log("total hours" , totalHours)
        }
      }

      // Update the totalHours in the model
      attendance.totalHours = totalHours;
      console.log("Calculated total hours:", totalHours); // Debugging

    } else {
      // If no entry exists, create a new attendance record with the check-out time only
      attendance = new AttendanceModel({
        empId,
        date: checkoutDate,
        timeLogs: [{ checkIn: null, checkOut: checkoutTime }],
        totalHours: 0  // Initialize as 0 (since there's no check-in time)
      });
      console.log('New attendance created without check-in.');
    }

    // Save or update the attendance record
    const savedAttendance = await attendance.save();
    console.log("Saved attendance:", savedAttendance); // Debugging

    // Update the employee's attendanceTime array and reset 'check' status
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



// const checkout = asyncHandler(async (req, res) => {
//   try {
//     const { empId, setTime } = req.body;
//     const checkoutTime = new Date(setTime);
//     const checkoutDate = extractDate(checkoutTime); // Ensure this function returns YYYY-MM-DD format

//     // Find if there's already an attendance entry for this employee on the same date
//     let attendance = await AttendanceModel.findOne({
//       empId,
//       date: checkoutDate
//     });

//     // Initialize formattedTotalHours
//     let formattedTotalHours = "0 hours 0 minutes"; // Default value

//     if (attendance) {
//       // If the attendance entry exists, add the check-out time to the last log
//       const lastLog = attendance.timeLogs[attendance.timeLogs.length - 1];

//       if (lastLog && lastLog.checkIn && !lastLog.checkOut) {
//         // Update existing check-in log with check-out time
//         lastLog.checkOut = checkoutTime;
//       } else {
//         // If no matching log or all are checked out, create a new log
//         attendance.timeLogs.push({ checkIn: null, checkOut: checkoutTime });
//       }

//       // Calculate total working hours
//       let totalHours = 0;

//       // Calculate total hours worked from timeLogs
//       for (const log of attendance.timeLogs) {
//         if (log.checkIn && log.checkOut) {
//           const checkInDate = new Date(log.checkIn);
//           const checkOutDate = new Date(log.checkOut);
//           totalHours += (checkOutDate - checkInDate) / (1000 * 60 * 60); // Convert ms to hours
//         }
//       }

//       attendance.totalHours = totalHours; // Update total hours

//       // Convert total hours into hours and minutes only if totalHours > 0
//       if (totalHours > 0) {
//         const hours = Math.floor(totalHours); // Whole hours
//         const minutes = Math.round((totalHours - hours) * 60); // Convert decimal to minutes
//         formattedTotalHours = `${hours} hours ${minutes} minutes`; // Format as required
//         attendance.totalHours = formattedTotalHours; // Store formatted time in attendance
//       }
      
//     } else {
//       // If no entry exists, create a new attendance record with check-out time
//       attendance = new AttendanceModel({
//         empId,
//         date: checkoutDate,
//         timeLogs: [{ checkIn: null, checkOut: checkoutTime }],
//         totalHours: 0 
//       });
//     }

//     // Save or update the attendance record
//     const savedAttendance = await attendance.save();

//     // Update the employee's attendanceTime array
//     await EmployeeModel.findByIdAndUpdate(
//       empId,
//       { $addToSet: { attendanceTime: savedAttendance._id }, check: 0 }, // Reset check to 0 on checkout
//       { new: true }
//     );

//     res.status(200).json({
//       message: 'Check-out successful',
//       attendance: savedAttendance,
//       formattedTotalHours // Send formatted hours and minutes (will always have a value)
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: 'Failed to check out',
//       error: err.message
//     });
//   }
// });


module.exports = { checkin,checkout };
