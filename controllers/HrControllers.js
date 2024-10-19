const asyncHandler = require('express-async-handler');
const HrModel = require('../models/HrModel');
const { generateToken } = require('../config/jwtToken');


const Register = asyncHandler( async(req,res)=>{
    try{
     const newHR = await HrModel.create(req.body)
     const token = generateToken(newHR._id);
 
     res.status(201).json({ newHR, token });
    }catch(error){
     res.status(500).json({ message: 'Registration failed', error: error.message });
    }
    
 })

module.exports = {
   Register,
};
