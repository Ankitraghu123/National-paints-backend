const mongoose = require('mongoose');
const EmployeeModel = require('./models/EmployeeModel'); // Adjust path based on your file structure
const AttendanceModel = require('./models/AttendanceModel'); // Adjust path based on your file structure

// MongoDB connection
mongoose.connect('mongodb+srv://skyinfogroups:mxr4wxSeOxgmAMSw@cluster0.mvupy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Array of SQL attendance data (this mimics your SQL insert data)
const labourAttendanceData = [
  { id: 1, emp_id: 1, date: '2024-07-01', check_in: '09:41:34', check_out: '20:58:12' },
  { id: 2, emp_id: 1, date: '2024-07-02', check_in: '09:59:49', check_out: '18:36:24' },
  { id: 3, emp_id: 1, date: '2024-07-03', check_in: '09:58:31', check_out: '18:43:43' },
  { id: 4, emp_id: 1, date: '2024-07-04', check_in: '10:00:00', check_out: '18:30:00' },
  { id: 5, emp_id: 1, date: '2024-07-05', check_in: '09:51:02', check_out: '18:35:49' },
  { id: 6, emp_id: 1, date: '2024-07-06', check_in: '09:53:06', check_out: '18:34:59' },
  { id: 7, emp_id: 1, date: '2024-07-07', check_in: '09:49:32', check_out: '18:34:32' },
  { id: 8, emp_id: 1, date: '2024-07-08', check_in: '09:51:16', check_out: '18:34:25' },
  { id: 9, emp_id: 1, date: '2024-07-09', check_in: '09:48:53', check_out: '18:35:19' },
  { id: 10, emp_id: 1, date: '2024-07-10', check_in: '09:49:21', check_out: '18:33:39' },
  { id: 11, emp_id: 1, date: '2024-07-11', check_in: '10:00:00', check_out: '18:30:00' },
  { id: 12, emp_id: 1, date: '2024-07-12', check_in: '09:54:28', check_out: '18:32:00' },
  { id: 13, emp_id: 1, date: '2024-07-13', check_in: '09:57:23', check_out: '22:19:29' },
  { id: 14, emp_id: 1, date: '2024-07-14', check_in: '09:48:49', check_out: '20:40:40' },
  { id: 15, emp_id: 1, date: '2024-07-15', check_in: '10:00:00', check_out: '18:30:00' },
  { id: 16, emp_id: 1, date: '2024-07-16', check_in: '09:45:31', check_out: '18:32:53' },
  { id: 17, emp_id: 1, date: '2024-07-17', check_in: '09:46:36', check_out: '18:54:30' },
  { id: 18, emp_id: 1, date: '2024-07-18', check_in: '10:00:00', check_out: '18:30:00' },
  { id: 19, emp_id: 1, date: '2024-07-19', check_in: '10:00:00', check_out: '18:30:00' },
  { id: 20, emp_id: 1, date: '2024-07-20', check_in: '09:43:07', check_out: '22:17:09' },
  { id: 21, emp_id: 1, date: '2024-07-21', check_in: '09:48:39', check_out: '21:02:25' },
  { id: 22, emp_id: 1, date: '2024-07-22', check_in: '09:43:42', check_out: '20:44:47' },
  { id: 23, emp_id: 1, date: '2024-07-23', check_in: '09:47:39', check_out: '18:33:23' },
  { id: 24, emp_id: 1, date: '2024-07-24', check_in: '09:52:23', check_out: '18:33:03' },
  { id: 25, emp_id: 1, date: '2024-07-25', check_in: '10:00:00', check_out: '18:30:00' },
  { id: 26, emp_id: 1, date: '2024-07-26', check_in: '09:52:55', check_out: '18:33:25' },
  { id: 27, emp_id: 1, date: '2024-07-27', check_in: '09:48:49', check_out: '18:33:20' },
  { id: 28, emp_id: 1, date: '2024-07-28', check_in: '10:00:00', check_out: '19:04:30' },
  { id: 29, emp_id: 1, date: '2024-07-29', check_in: '09:51:58', check_out: '18:33:36' },
  { id: 30, emp_id: 1, date: '2024-07-30', check_in: '08:52:34', check_out: '18:35:12' },
  { id: 31, emp_id: 1, date: '2024-07-31', check_in: '09:50:46', check_out: '21:04:28' },
  { id: 32, emp_id: 2, date: '2024-07-01', check_in: '00:00:00', check_out: '00:00:00' },
  { id: 33, emp_id: 2, date: '2024-07-02', check_in: '09:49:38', check_out: '18:34:25' },
  { id: 34, emp_id: 2, date: '2024-07-03', check_in: '09:48:28', check_out: '18:32:49' },
  { id: 35, emp_id: 2, date: '2024-07-04', check_in: '10:00:00', check_out: '18:30:00' },
  { id: 36, emp_id: 2, date: '2024-07-05', check_in: '09:46:07', check_out: '18:32:29' },
  { id: 37, emp_id: 2, date: '2024-07-06', check_in: '09:46:47', check_out: '18:32:57' },
  { id: 38, emp_id: 2, date: '2024-07-07', check_in: '09:46:10', check_out: '18:32:57' },
  { id: 39, emp_id: 2, date: '2024-07-08', check_in: '09:47:42', check_out: '18:32:42' },
  { id: 40, emp_id: 2, date: '2024-07-09', check_in: '09:43:45', check_out: '18:34:19' },
  { id: 41, emp_id: 2, date: '2024-07-10', check_in: '09:43:55', check_out: '18:32:56' },
  { id: 42, emp_id: 2, date: '2024-07-11', check_in: '10:00:00', check_out: '18:30:00' },
  { id: 43, emp_id: 2, date: '2024-07-12', check_in: '09:43:57', check_out: '18:30:56' },
  { id: 44, emp_id: 2, date: '2024-07-13', check_in: '09:44:12', check_out: '22:16:04' },
  { id: 45, emp_id: 2, date: '2024-07-14', check_in: '09:43:00', check_out: '20:35:05' },
  { id: 46, emp_id: 2, date: '2024-07-15', check_in: '10:00:00', check_out: '18:30:00' },
  { id: 47, emp_id: 2, date: '2024-07-16', check_in: '09:42:43', check_out: '18:31:11' },
  { id: 48, emp_id: 2, date: '2024-07-17', check_in: '09:42:24', check_out: '18:32:37' },
  { id: 49, emp_id: 2, date: '2024-07-18', check_in: '10:00:00', check_out: '18:30:00' },
  { id: 50, emp_id: 2, date: '2024-07-19', check_in: '10:00:00', check_out: '18:30:00' },
  { id: 51, emp_id: 2, date: '2024-07-20', check_in: '09:41:51', check_out: '22:13:13' },
  { id: 52, emp_id: 2, date: '2024-07-21', check_in: '09:46:04', check_out: '20:51:34' },
  { id: 53, emp_id: 2, date: '2024-07-22', check_in: '09:42:48', check_out: '20:40:45' },
  { id: 54, emp_id: 2, date: '2024-07-23', check_in: '09:43:32', check_out: '18:32:06' },
  { id: 55, emp_id: 2, date: '2024-07-24', check_in: '09:46:22', check_out: '18:31:16' },
  { id: 56, emp_id: 2, date: '2024-07-25', check_in: '10:00:00', check_out: '18:30:00' },
  { id: 57, emp_id: 2, date: '2024-07-26', check_in: '09:47:38', check_out: '18:31:23' },
  { id: 58, emp_id: 2, date: '2024-07-27', check_in: '09:43:31', check_out: '18:31:58' },
  { id: 59, emp_id: 2, date: '2024-07-28', check_in: '00:00:00', check_out: '00:00:00' },
  { id: 60, emp_id: 2, date: '2024-07-29', check_in: '09:44:27', check_out: '18:31:18' },
  { id: 61, emp_id: 2, date: '2024-07-30', check_in: '09:44:40', check_out: '18:31:39' },
  { id: 62, emp_id: 2, date: '2024-07-31', check_in: '09:44:55', check_out: '21:01:16' },
  { id: 63, emp_id: 3, date: '2024-07-01', check_in: '09:41:08', check_out: '21:28:40' },
{ id: 64, emp_id: 3, date: '2024-07-02', check_in: '10:05:43', check_out: '18:36:12' },
{ id: 65, emp_id: 3, date: '2024-07-03', check_in: '10:01:16', check_out: '18:34:12' },
{ id: 66, emp_id: 3, date: '2024-07-04', check_in: '10:00:00', check_out: '18:30:00' },
{ id: 67, emp_id: 3, date: '2024-07-05', check_in: '09:54:04', check_out: '18:32:53' },
{ id: 68, emp_id: 3, date: '2024-07-06', check_in: '09:55:53', check_out: '18:34:17' },
{ id: 69, emp_id: 3, date: '2024-07-07', check_in: '09:59:17', check_out: '18:32:21' },
{ id: 70, emp_id: 3, date: '2024-07-08', check_in: '09:57:31', check_out: '18:33:04' },
{ id: 71, emp_id: 3, date: '2024-07-09', check_in: '09:55:00', check_out: '18:34:07' },
{ id: 72, emp_id: 3, date: '2024-07-10', check_in: '09:51:51', check_out: '18:33:11' },
{ id: 73, emp_id: 3, date: '2024-07-11', check_in: '10:00:00', check_out: '18:30:00' },
{ id: 74, emp_id: 3, date: '2024-07-12', check_in: '09:55:42', check_out: '18:31:44' },
{ id: 75, emp_id: 3, date: '2024-07-13', check_in: '09:52:59', check_out: '22:14:43' },
{ id: 76, emp_id: 3, date: '2024-07-14', check_in: '09:54:23', check_out: '20:33:40' },
{ id: 77, emp_id: 3, date: '2024-07-15', check_in: '10:00:00', check_out: '18:30:00' },
{ id: 78, emp_id: 3, date: '2024-07-16', check_in: '09:52:32', check_out: '17:41:01' },
{ id: 79, emp_id: 3, date: '2024-07-17', check_in: '09:52:10', check_out: '18:33:00' },
{ id: 80, emp_id: 3, date: '2024-07-18', check_in: '10:00:00', check_out: '18:30:00' },
{ id: 81, emp_id: 3, date: '2024-07-19', check_in: '10:00:00', check_out: '18:30:00' },
{ id: 82, emp_id: 3, date: '2024-07-20', check_in: '09:47:55', check_out: '20:58:34' },
{ id: 83, emp_id: 3, date: '2024-07-21', check_in: '09:51:45', check_out: '20:50:02' },
{ id: 84, emp_id: 3, date: '2024-07-22', check_in: '09:50:29', check_out: '20:41:08' },
{ id: 85, emp_id: 3, date: '2024-07-23', check_in: '09:58:35', check_out: '18:32:52' },
{ id: 86, emp_id: 3, date: '2024-07-24', check_in: '09:56:46', check_out: '18:32:35' },
{ id: 87, emp_id: 3, date: '2024-07-25', check_in: '10:00:00', check_out: '18:30:00' },
{ id: 88, emp_id: 3, date: '2024-07-26', check_in: '10:00:29', check_out: '18:32:40' },
{ id: 89, emp_id: 3, date: '2024-07-27', check_in: '09:58:34', check_out: '18:31:50' },
{ id: 90, emp_id: 3, date: '2024-07-28', check_in: '09:50:11', check_out: '18:32:01' },
{ id: 91, emp_id: 3, date: '2024-07-29', check_in: '09:58:37', check_out: '18:32:06' },
{ id: 92, emp_id: 3, date: '2024-07-30', check_in: '09:52:09', check_out: '18:31:59' },
{ id: 93, emp_id: 3, date: '2024-07-31', check_in: '09:55:50', check_out: '21:00:47' },
{ id: 94, emp_id: 4, date: '2024-07-01', check_in: '10:28:28', check_out: '20:35:02' },
{ id: 95, emp_id: 4, date: '2024-07-02', check_in: '10:13:46', check_out: '18:34:44' },
{ id: 96, emp_id: 4, date: '2024-07-03', check_in: '14:28:00', check_out: '18:33:47' },
{ id: 97, emp_id: 4, date: '2024-07-04', check_in: '10:00:00', check_out: '18:30:00' },
{ id: 98, emp_id: 4, date: '2024-07-05', check_in: '10:34:05', check_out: '18:34:06' },
{ id: 99, emp_id: 4, date: '2024-07-06', check_in: '10:11:05', check_out: '18:34:21' },
{ id: 100, emp_id: 4, date: '2024-07-07', check_in: '10:57:45', check_out: '18:33:13' },
{ id: 101, emp_id: 4, date: '2024-07-08', check_in: '11:50:01', check_out: '18:32:48' },
{ id: 102, emp_id: 4, date: '2024-07-09', check_in: '00:00:00', check_out: '00:00:00' },
{ id: 103, emp_id: 4, date: '2024-07-10', check_in: '10:20:36', check_out: '18:32:51' },
{ id: 104, emp_id: 4, date: '2024-07-11', check_in: '10:00:00', check_out: '18:30:00' },
{ id: 105, emp_id: 4, date: '2024-07-12', check_in: '10:54:15', check_out: '18:31:09' },
{ id: 106, emp_id: 4, date: '2024-07-13', check_in: '10:42:06', check_out: '22:16:29' },
{ id: 107, emp_id: 4, date: '2024-07-14', check_in: '09:46:36', check_out: '20:33:44' },
{ id: 108, emp_id: 4, date: '2024-07-15', check_in: '10:00:00', check_out: '18:30:00' },
{ id: 109, emp_id: 4, date: '2024-07-16', check_in: '10:07:06', check_out: '18:31:57' },
{ id: 110, emp_id: 4, date: '2024-07-17', check_in: '10:16:26', check_out: '18:33:09' },
{ id: 111, emp_id: 4, date: '2024-07-18', check_in: '10:00:00', check_out: '18:30:00' },
{ id: 112, emp_id: 4, date: '2024-07-19', check_in: '10:00:00', check_out: '18:30:00' },
{ id: 113, emp_id: 4, date: '2024-07-20', check_in: '09:56:07', check_out: '22:14:50' },
{ id: 114, emp_id: 4, date: '2024-07-21', check_in: '10:44:11', check_out: '20:51:29' },
{ id: 115, emp_id: 4, date: '2024-07-22', check_in: '10:22:58', check_out: '20:42:58' },
{ id: 116, emp_id: 4, date: '2024-07-23', check_in: '10:19:19', check_out: '18:33:01' },
{ id: 117, emp_id: 4, date: '2024-07-24', check_in: '10:21:19', check_out: '18:33:19' },
{ id: 118, emp_id: 4, date: '2024-07-25', check_in: '10:00:00', check_out: '18:30:00' },
{ id: 119, emp_id: 4, date: '2024-07-26', check_in: '10:39:34', check_out: '18:31:40' },
{ id: 120, emp_id: 4, date: '2024-07-27', check_in: '09:52:27', check_out: '18:32:39' },
{ id: 121, emp_id: 4, date: '2024-07-28', check_in: '10:43:12', check_out: '18:32:36' },
{ id: 122, emp_id: 4, date: '2024-07-29', check_in: '10:10:18', check_out: '18:32:33' },
{ id: 123, emp_id: 4, date: '2024-07-30', check_in: '10:10:26', check_out: '18:32:31' },
{ id: 124, emp_id: 4, date: '2024-07-31', check_in: '10:27:56', check_out: '21:01:09' }

];

  

const migrateAttendanceData = async () => {
    try {
        for (let attendance of labourAttendanceData) {
            // Find the employee by SQL id
            const employee = await EmployeeModel.findOne({ sqlId: attendance.emp_id });

            if (employee) {
                // Create a new attendance record
                const checkInTime = new Date(`${attendance.date}T${attendance.check_in}`); // assuming attendance.date is in 'YYYY-MM-DD' format
                const checkOutTime = new Date(`${attendance.date}T${attendance.check_out}`);

                // If check-out time is from the previous day (after adjusting for time zone)
                if (checkOutTime < checkInTime) {
                    // Adjust checkOutTime to the next day
                    checkOutTime.setDate(checkOutTime.getDate() + 1);
                }

                const thresholdTime = new Date(checkInTime);
                thresholdTime.setHours(10, 0, 0, 0); // Set to 10:00 AM

                // If checkInTime is before 10:00 AM and not equal to checkOutTime
                if (checkInTime < thresholdTime && checkInTime.getTime() !== checkOutTime.getTime()) {
                    checkInTime.setHours(10, 0, 0); // Set to 10:00 AM
                }

                // Calculate total hours
                const totalHours = (checkInTime.getTime() === checkOutTime.getTime()) ? 0 : (checkOutTime - checkInTime) / (1000 * 60 * 60); // Convert milliseconds to hours

                const newAttendance = new AttendanceModel({
                    empId: employee._id,
                    date: attendance.date,
                    timeLogs: [{ checkIn: checkInTime, checkOut: checkOutTime }],
                    totalHours: totalHours,
                    sqlId: attendance.id // Optional to keep track of SQL ID
                });

                await newAttendance.save();

                // Push the new attendance ID to the employee's attendanceTime array
                employee.attendanceTime.push(newAttendance._id);
                await employee.save(); // Save the updated employee document

                console.log(`Added attendance for ${employee.name} on ${attendance.date}`);
            } else {
                console.log(`Employee with sqlId ${attendance.emp_id} not found.`);
            }
        }

        console.log('Attendance data migration complete');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error during migration:', error);
        mongoose.connection.close();
    }
};


  
  // Call the migration function
  migrateAttendanceData();

