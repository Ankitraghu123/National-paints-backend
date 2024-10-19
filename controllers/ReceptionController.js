const asyncHandler = require('express-async-handler');
const ReceptionModel = require('../models/ReceptionModel');
const { generateToken } = require('../config/jwtToken');

const Register = asyncHandler(async (req, res) => {
  try {
    const newReception = await ReceptionModel.create(req.body);
    const token = generateToken(newReception._id);

    res.status(201).json({ newReception, token });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});



module.exports = {
  Register,
};
