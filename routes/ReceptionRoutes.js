const express = require('express');
const { Register} = require('../controllers/ReceptionController');
const router = express.Router();


router.post('/register', Register);




module.exports = router;