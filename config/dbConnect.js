const mongoose = require('mongoose')

const dbConnect = () => {
    try{
        mongoose.connect(process.env.MONGODB_URL_LOCAL)
        console.log('database connected')
    }catch(err){
        console.log(err)
    }
} 

module.exports = dbConnect
