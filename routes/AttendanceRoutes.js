const express = require('express');
const { checkin,checkout, getAttendance, getMonthlyAttendance, todaysPresent, todaysAbsent, todaysAvailable, editAttendanceTime } = require('../controllers/AttendanceControllers');
const { isReceptionist } = require('../middlewares/authMiddlewares');
const router = express.Router();


router.post('/checkin', checkin);

router.post('/checkout', checkout);

router.get('/todays-present',todaysPresent)

router.get('/todays-absent',todaysAbsent)

router.get('/todays-avail',todaysAvailable)

router.put('/edit-attendance-time',editAttendanceTime)



module.exports = router;