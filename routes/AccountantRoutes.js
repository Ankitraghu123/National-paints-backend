const express = require('express');
const { Register} = require('../controllers/AccountantController');
const { isAdmin } = require('../middlewares/authMiddlewares');
const router = express.Router();


router.post('/register', Register);


module.exports = router;