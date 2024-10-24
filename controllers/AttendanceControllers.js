
const asyncHandler = require('express-async-handler');
const AttendanceModel = require('../models/AttendanceModel');
const EmployeeModel = require('../models/EmployeeModel');
const moment = require('moment');
const UnPaidEmployeeModel = require('../models/UnPaidEmployeeModel');
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

    const employeeUpdate = await EmployeeModel.findByIdAndUpdate(
      empId,
      { $addToSet: { attendanceTime: savedAttendance._id }, check: 1 }, 
      { new: true }
    );

    // If employee not found in EmployeeModel, check UnPaidEmployeeModel
    if (!employeeUpdate) {
      const unpaidEmployeeUpdate = await UnPaidEmployeeModel.findByIdAndUpdate(
        empId,
        { $addToSet: { attendanceTime: savedAttendance._id },check: 1 },
        { new: true }
      );

      if (!unpaidEmployeeUpdate) {
        return res.status(404).json({
          message: 'Employee not found in both Employee and UnPaidEmployee models'
        });
      }
    }

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
    const employeeUpdate = await EmployeeModel.findByIdAndUpdate(
      empId,
      { $addToSet: { attendanceTime: savedAttendance._id }, check: 0 }, 
      { new: true }
    );

    // If employee not found in EmployeeModel, check UnPaidEmployeeModel
    if (!employeeUpdate) {
      const unpaidEmployeeUpdate = await UnPaidEmployeeModel.findByIdAndUpdate(
        empId,
        { $addToSet: { attendanceTime: savedAttendance._id },check: 0 },
        { new: true }
      );

      if (!unpaidEmployeeUpdate) {
        return res.status(404).json({
          message: 'Employee not found in both Employee and UnPaidEmployee models'
        });
      }
    }

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
    }).populate({
      path: 'empId',
      model: 'Employee', // Only populate 'empId' if it's from 'Employee' model
    });


    // Map to get only the employee data
    const presentEmployees = presentRecords.map(record => ({
      _id: record.empId?._id,
      name: record.empId?.name,
      salary: record.empId?.salary,
      empType: record.empId?.empType,
      status: record.empId?.status
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
    }); // Populate to get employee details

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
    }).populate({
      path: 'empId',
      model: 'Employee', // Only populate 'empId' if it's from 'Employee' model
    });; // Populate employee details

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


const editAttendanceTime = async (req, res) => {
  const { empId, date, checkIn, checkOut } = req.body;
  console.log(req.body);
  
  // Define the local offset for IST (UTC +5:30)
  const localOffset = 5.5 * 60 * 60 * 1000;

  try {
    // Find the attendance record for the specific employee and date
    let attendanceRecord = await AttendanceModel.findOne({
      empId,
      date
    });

    console.log(attendanceRecord);

    // If no attendance record exists, create a new one
    if (!attendanceRecord) {
      attendanceRecord = new AttendanceModel({
        empId,
        date,
        timeLogs: [{}]  // Initialize with an empty timeLogs array
      });
    }

    // Update the check-in time
    if (checkIn) {
      const [hours, minutes] = checkIn.split(':'); // Assuming checkIn is in "HH:mm" format
      let checkInDateTime = new Date(date);
      checkInDateTime.setUTCHours(hours - 5, minutes - 30); // Adjust for local offset to UTC
      attendanceRecord.timeLogs[0].checkIn = checkInDateTime;

      // Ensure check-in is not before 10:00 AM
      const earliestCheckIn = new Date(date);
      earliestCheckIn.setUTCHours(10, 0); // 10:00 AM in local time
      const earliestCheckInUTC = new Date(earliestCheckIn.getTime() - localOffset) // Convert to UTC

      if (checkInDateTime < earliestCheckIn) {
        checkInDateTime = earliestCheckInUTC // Set to 10:00 AM if earlier
      }

      attendanceRecord.timeLogs[0].checkIn = checkInDateTime;
    }

    // Update the check-out time
    if (checkOut) {
      const [hours, minutes] = checkOut.split(':'); // Assuming checkOut is in "HH:mm" format
      const checkOutDateTime = new Date(date);
      checkOutDateTime.setUTCHours(hours - 5, minutes - 30); // Adjust for local offset to UTC
      attendanceRecord.timeLogs[0].checkOut = checkOutDateTime;
    }

    // Calculate total hours if both check-in and check-out times are provided
    const { checkIn: checkInTime, checkOut: checkOutTime } = attendanceRecord.timeLogs[0];
    if (checkInTime && checkOutTime) {
      const totalHours = (checkOutTime - checkInTime) / (1000 * 60 * 60); // Convert ms to hours
      attendanceRecord.totalHours = totalHours > 0 ? totalHours : 0; // Ensure non-negative
    }

    // Save the updated or newly created attendance record
    const savedAttendance = await attendanceRecord.save();
    console.log(savedAttendance);

    const employeeUpdate = await EmployeeModel.findByIdAndUpdate(
      empId,
      { $addToSet: { attendanceTime: savedAttendance._id } },
      { new: true }
    );

    // If employee not found, handle accordingly
    if (!employeeUpdate) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Attendance record updated successfully', attendance: savedAttendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating attendance record', error: error.message });
  }
};





module.exports = { checkin,checkout,todaysPresent,todaysAbsent,todaysAvailable,editAttendanceTime };
