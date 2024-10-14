const asyncHandler = require('express-async-handler');
const EmployeeModel = require('../models/EmployeeModel');
const AttendanceModel = require('../models/AttendanceModel');

const addEmployee = asyncHandler(async (req, res) => {
    try {
        const newEmployee = await EmployeeModel.create(req.body);
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(500).json({ message: 'Failed to add employee', error: err.message });
    }
});


const getAllEmployee = asyncHandler(async (req, res) => {
    try {
        const allEmployee = await EmployeeModel.find().populate('attendanceTime');

        console.log(allEmployee)
        res.status(201).json(allEmployee);
    } catch (err) {
        res.status(500).json({ message: 'Failed to add employee', error: err.message });
    }
});

const getEmployeeAttendance = async (req, res) => {
    try {
      const { employeeId, month } = req.params;
  
      // Find the employee and populate the attendance records
      const attendanceRecords = await AttendanceModel.find({ empId: employeeId });
  
      // Filter attendance records for the selected month
      const filteredRecords = attendanceRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getFullYear() === new Date(month).getFullYear() && 
               recordDate.getMonth() === new Date(month).getMonth();
      });
  
      res.status(200).json(filteredRecords);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };


module.exports = {
    addEmployee,
    getAllEmployee,
    getEmployeeAttendance
};
