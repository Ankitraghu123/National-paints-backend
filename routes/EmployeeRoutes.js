const express = require('express');
const { addEmployee, getAllEmployee, getEmployeeAttendance, unpaidEmployees, unapprovedEmployees, approveEmployee, editEmployee, transferToPaidEmployee } = require('../controllers/EmployeeControllers');
const router = express.Router();


router.post('/add', addEmployee);

router.get('/all', getAllEmployee);

router.get('/all', getAllEmployee);

router.get('/unpaid',unpaidEmployees)

router.get('/unapproved',unapprovedEmployees)

router.put('/approve/:id',approveEmployee)

router.put('/edit/:id',editEmployee)

router.post('/transfer-to-paid/:id',transferToPaidEmployee)

router.get('/:employeeId/:month', getEmployeeAttendance);

module.exports = router;