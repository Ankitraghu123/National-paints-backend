const express = require('express');
const { addEmployee, getAllEmployee } = require('../controllers/EmployeeControllers');
const router = express.Router();


router.post('/add', addEmployee);

router.get('/all', getAllEmployee);



module.exports = router;