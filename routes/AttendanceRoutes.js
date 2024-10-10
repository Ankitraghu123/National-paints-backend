const express = require('express');
const { checkin,checkout, getAttendance, getMonthlyAttendance } = require('../controllers/AttendanceControllers');
const router = express.Router();


router.post('/checkin', checkin);

router.post('/checkout', checkout);




module.exports = router;