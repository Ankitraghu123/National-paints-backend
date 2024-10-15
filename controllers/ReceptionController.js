const asyncHandler = require('express-async-handler');
const ReceptionModel = require('../models/ReceptionModel');
const { generateToken } = require('../config/jwtToken');


const Register = asyncHandler( async(req,res)=>{
    try{
     const newReception = await ReceptionModel.create(req.body)
     const token = generateToken(newReception._id);
 
     res.status(201).json({ newReception, token });
    }catch(error){
     res.status(500).json({ message: 'Registration failed', error: error.message });
    }
    
 })


 const Login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    console.log(req.body)
  
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide both email and password');
    }
  
    const receptionist = await ReceptionModel.findOne({ email });
  
    if (receptionist && (await receptionist.isPasswordMatched(password))) {
      const token = generateToken(receptionist._id);
      res.status(200).json({
        _id: receptionist._id,
        name: receptionist.name,
        email: receptionist.email,
        mobileNumber: receptionist.mobileNumber,
        token,
      });
    } else {
      res.status(401); 
      throw new Error('Invalid email or password');
    }
  });




module.exports = {
   Register,
   Login
};
