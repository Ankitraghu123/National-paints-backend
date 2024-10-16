const express = require('express');
const { checkin,checkout, getAttendance, getMonthlyAttendance, todaysPresent, todaysAbsent, todaysAvailable } = require('../controllers/AttendanceControllers');
const router = express.Router();


router.post('/checkin', checkin);

router.post('/checkout', checkout);

router.get('/todays-present',todaysPresent)

router.get('/todays-absent',todaysAbsent)

router.get('/todays-avail',todaysAvailable)



module.exports = router;