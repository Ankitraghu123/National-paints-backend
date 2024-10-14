const express = require('express');
const { addEmployee, getAllEmployee, getEmployeeAttendance } = require('../controllers/EmployeeControllers');
const router = express.Router();


router.post('/add', addEmployee);

router.get('/all', getAllEmployee);

router.get('/:employeeId/:month', getEmployeeAttendance);

module.exports = router;