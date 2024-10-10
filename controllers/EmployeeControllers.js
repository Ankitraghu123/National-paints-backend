const asyncHandler = require('express-async-handler');
const EmployeeModel = require('../models/EmployeeModel');

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


module.exports = {
    addEmployee,
    getAllEmployee
};
