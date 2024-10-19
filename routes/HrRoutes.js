const express = require('express');
const { Register} = require('../controllers/HrControllers');
const router = express.Router();


router.post('/register', Register);


module.exports = router;