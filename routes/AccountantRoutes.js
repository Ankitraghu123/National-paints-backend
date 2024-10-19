const express = require('express');
const { Register} = require('../controllers/AccountantController');
const { isAdmin } = require('../middlewares/authMiddlewares');
const router = express.Router();


router.post('/register',isAdmin, Register);


module.exports = router;