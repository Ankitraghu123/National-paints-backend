const asyncHandler = require('express-async-handler');
const SalaryModel = require('../models/SalaryModel'); // Adjust the path as needed
const EmployeeModel = require('../models/EmployeeModel'); // Adjust the path as needed

const putSalary = asyncHandler(async (req, res) => {
    try {
      const { month, amount, empId } = req.body;
  
  
      // Find employee by ID
      const employee = await EmployeeModel.findById(empId);
      if (!employee) {
        console.log("Employee not found");
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      const providedMonth = new Date(month).getMonth();
      const providedYear = new Date(month).getFullYear();
  
      const existingSalary = await SalaryModel.findOne({
        _id: { $in: employee.salaryArray }, // Check within employee's salaryArray
        $expr: {
          $and: [
            { $eq: [{ $month: "$month" }, providedMonth + 1] }, // +1 because $month returns 1-12
            { $eq: [{ $year: "$month" }, providedYear] },
          ],
        },
      });
      
  
      if (existingSalary) {
        return res.status(400).json({ message: `Salary for the month of ${providedMonth + 1} already exists.` });
      }
  
      const salaryRecord = new SalaryModel({
        month, // Storing the whole date object
        amount,
      });
  
      await salaryRecord.save();
  
      employee.salaryArray.push(salaryRecord._id);
      await employee.save();
  
      res.status(200).json({
        message: `Salary for the month of ${providedMonth + 1} updated and linked to employee successfully`,
        salaryRecord,
        employee,
      });
  
    } catch (error) {
      console.error("Error in putSalary controller:", error);
      res.status(500).json({
        message: 'Failed to update salary for the month',
        error: error.message,
      });
    }
  });

  const paySalary = asyncHandler(async (req, res) => {
    try {
      const { empId, month } = req.body;
  
      const employee = await EmployeeModel.findById(empId);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      const providedMonth = new Date(month).getMonth();
      const providedYear = new Date(month).getFullYear();
  
      const salaryRecord = await SalaryModel.findOne({
        _id: { $in: employee.salaryArray },
        $expr: {
          $and: [
            { $eq: [{ $month: "$month" }, providedMonth + 1] }, 
            { $eq: [{ $year: "$month" }, providedYear] },
          ],
        },
      });
  
      if (!salaryRecord) {
        return res.status(404).json({ message: `Salary record for the month of ${providedMonth + 1} not found.` });
      }
  
      salaryRecord.isPaid = true;
      await salaryRecord.save();
  
      res.status(200).json({
        message: `Salary for the month of ${providedMonth + 1} marked as paid.`,
        salaryRecord,
      });
    } catch (error) {
      console.error("Error in paySalary controller:", error);
      res.status(500).json({
        message: 'Failed to mark salary as paid',
        error: error.message,
      });
    }
  });


  const generateSalarySlip = asyncHandler(async (req, res) => {
    try {
        // Destructure `month` (as a Date object) and `empId` from the request body
        const { month, empId } = req.body;

        // Extract the year and month from the provided date object
        const providedMonth = new Date(month).getMonth(); // 0-11
        const providedYear = new Date(month).getFullYear();

        // Find the employee by empId and populate the salaryArray
        const employee = await EmployeeModel.findById(empId).populate('salaryArray');

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Find the salary for the specified month and year in the salaryArray
        const salaryForMonth = employee.salaryArray.find(salary => {
            const salaryMonth = new Date(salary.month).getMonth(); // Assuming salary.date is a Date object
            const salaryYear = new Date(salary.month).getFullYear();
            
            return salaryMonth === providedMonth && salaryYear === providedYear;
        });

        if (!salaryForMonth) {
            return res.status(404).json({ message: `Salary data not found for the month: ${providedMonth + 1} and year: ${providedYear}` });
        }

        // Send the employee data along with the salary for the specified month
        res.status(200).json({
            employeeDetails: employee,
            salaryDetails: salaryForMonth
        });
    } catch (err) {
        // Handle any errors
        res.status(500).json({ message: 'Failed to get employee or salary data', error: err.message });
    }
});
  
module.exports = {
  putSalary,
  paySalary,
  generateSalarySlip
};
