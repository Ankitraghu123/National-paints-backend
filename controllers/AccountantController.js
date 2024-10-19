const asyncHandler = require('express-async-handler');
const AccountantModel = require('../models/AccountantModel');
const { generateToken } = require('../config/jwtToken');


const Register = asyncHandler( async(req,res)=>{
    try{
     const newAccountant = await AccountantModel.create(req.body)
     const token = generateToken(newAccountant._id);
 
     res.status(201).json({ newAccountant, token });
    }catch(error){
     res.status(500).json({ message: 'Registration failed', error: error.message });
    }
    
 })

module.exports = {
   Register,
};
