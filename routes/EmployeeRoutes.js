const express = require('express');
const { addEmployee, getAllEmployee, getEmployeeAttendance, unpaidEmployees, unapprovedEmployees, approveEmployee, editEmployee, transferToPaidEmployee, getSingleEmployee } = require('../controllers/EmployeeControllers');
const { putSalary, paySalary, generateSalarySlip } = require('../controllers/SalaryController');
const router = express.Router();


router.post('/add', addEmployee);

router.get('/all', getAllEmployee);

router.get('/all', getAllEmployee);


router.get('/unpaid',unpaidEmployees)

router.get('/unapproved',unapprovedEmployees)

router.get('/:id', getSingleEmployee);


router.put('/approve/:id',approveEmployee)

router.put('/edit/:id',editEmployee)

router.post('/transfer-to-paid/:id',transferToPaidEmployee)

router.get('/:employeeId/:month', getEmployeeAttendance);

router.post('/putSalary', putSalary);

router.post('/paySalary', paySalary);

router.post('/generate-salary-slip', generateSalarySlip);


module.exports = router;