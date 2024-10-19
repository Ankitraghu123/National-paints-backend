const dotenv = require('dotenv').config('./.env')
const express = require('express')
const dbConnect = require('./config/dbConnect')
dbConnect()
const { errorHandler, notFound } = require('./middlewares/errorHandler')
const app = express()
const cors = require('cors')


const employeeRouter = require('./routes/EmployeeRoutes')
const AttendanceRouter = require('./routes/AttendanceRoutes')
const HolidayRouter = require('./routes/HolidayRoutes')
const ReceptionRouter = require('./routes/ReceptionRoutes')
const HRRouter = require('./routes/HrRoutes')
const AccountantRouter = require('./routes/AccountantRoutes')
const AdminRouter = require('./routes/AdminRoutes')



const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

app.use(morgan('dev'))
app.use(cors())

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cookieParser())

app.use('/api/employee',employeeRouter)
app.use('/api/attendance',AttendanceRouter)
app.use('/api/holiday',HolidayRouter)
app.use('/api/reception',ReceptionRouter)
app.use('/api/hr',HRRouter)
app.use('/api/accountant',AccountantRouter)
app.use('/api/admin',AdminRouter)



app.use(notFound)
app.use(errorHandler)


app.listen(process.env.PORT,()=>{
    console.log(`server running on ${process.env.PORT}`)
})