const express = require('express');
const { addHoliday, getAllHoliday } = require('../controllers/HolidayControllers');
const router = express.Router();


router.post('/add', addHoliday);

router.get('/all', getAllHoliday);



module.exports = router;