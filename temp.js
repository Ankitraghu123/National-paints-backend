const mongoose = require('mongoose');
const EmployeeModel = require('./models/EmployeeModel'); // Adjust path based on your file structure

// MongoDB connection
mongoose.connect('mongodb+srv://skyinfogroups:mxr4wxSeOxgmAMSw@cluster0.mvupy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Array of SQL data (this mimics your SQL insert data)
const labourData = [
  { id: 1, person_id: 0, name: 'Rambhawan', salary: 13100, status: 'Active' },
  { id: 2, person_id: 0, name: 'SAEID', salary: 9200, status: 'Active' },
  { id: 3, person_id: 0, name: 'RAM SANJIVAN', salary: 15300, status: 'Active' },
  { id: 4, person_id: 0, name: 'SANDEEP PAWAR', salary: 7700, status: 'Active' },
  { id: 5, person_id: 0, name: 'RANJIT LODHI', salary: 7700, status: 'Active' },
  { id: 6, person_id: 0, name: 'HAKEEM AHMED', salary: 7700, status: 'Active' },
  { id: 7, person_id: 0, name: 'RAJU PRAJAPATI', salary: 9000, status: 'Active' },
  { id: 8, person_id: 0, name: 'JAMUNA PRASAD', salary: 9200, status: 'Active' },
  { id: 9, person_id: 0, name: 'SUMER SINGH', salary: 8700, status: 'Active' },
  { id: 10, person_id: 0, name: 'SHAILESH PATHAK', salary: 8700, status: 'Active' },
  { id: 11, person_id: 0, name: 'SANTOSH GAUR', salary: 7700, status: 'Active' },
  { id: 12, person_id: 0, name: 'RUPESH', salary: 8500, status: 'Active' },
  { id: 13, person_id: 0, name: 'PIYUSH RATORE', salary: 7700, status: 'Active' },
  { id: 14, person_id: 0, name: 'JAI KHARE', salary: 9200, status: 'Active' },
  { id: 15, person_id: 0, name: 'WASID KHAN', salary: 7700, status: 'Active' },
  { id: 16, person_id: 0, name: 'NAWAB SINGH', salary: 31000, status: 'Active' },
  { id: 17, person_id: 0, name: 'GOVIND DHARNEKAR', salary: 7700, status: 'Active' },
  { id: 18, person_id: 0, name: 'KALYAN SINGH MALI', salary: 0, status: 'Active' },
  { id: 19, person_id: 0, name: 'KALYAN SINGH', salary: 9000, status: 'Active' },
  { id: 20, person_id: 0, name: 'RAMSWAROOP', salary: 11000, status: 'Active' },
  { id: 21, person_id: 0, name: 'LAKSHMI', salary: 8250, status: 'Active' },
  { id: 22, person_id: 0, name: 'TULSA BAI', salary: 7650, status: 'Active' },
  { id: 23, person_id: 0, name: 'SANTOSH RAJAK', salary: 7600, status: 'Active' },
  { id: 24, person_id: 0, name: 'GAJRAJ SINGH', salary: 7600, status: 'Active' },
  { id: 25, person_id: 0, name: 'AMAR SINGH', salary: 7600, status: 'Active' },
  { id: 26, person_id: 0, name: 'AWDESH YADAV', salary: 10000, status: 'Active' },
  { id: 27, person_id: 0, name: 'VITHAL', salary: 9300, status: 'Active' },
  { id: 28, person_id: 0, name: 'RAVI GOWAI', salary: 7600, status: 'Active' },
  { id: 29, person_id: 0, name: 'BALARAM RATORE', salary: 8500, status: 'Active' },
  { id: 30, person_id: 0, name: 'ROHIT RAI', salary: 7700, status: 'Active' },
  { id: 31, person_id: 0, name: 'VISHAL KUSHWAHA', salary: 7700, status: 'Active' },
  { id: 32, person_id: 0, name: 'SANJAY DUBEY', salary: 10175, status: 'Active' },
  // { id: 33, person_id: 0, name: 'INDRA BAI', salary: 10000, status: 'Active' },
  { id: 34, person_id: 0, name: 'DHEERAJ LODHI', salary: 10000, status: 'Active' },
  { id: 35, person_id: 0, name: 'SUNIL DUBEY (DRIVER)', salary: 10000, status: 'Active' },
  { id: 36, person_id: 0, name: 'DEEPAK NAMDEO', salary: 7500, status: 'Active' },
  { id: 37, person_id: 0, name: 'SHIVKUMAR', salary: 7800, status: 'Active' },
  { id: 38, person_id: 0, name: 'DHANSINGH', salary: 7600, status: 'Active' },
  { id: 39, person_id: 0, name: 'MUNNALAL', salary: 7500, status: 'Active' },
  { id: 40, person_id: 0, name: 'SANJAY SINGH', salary: 0, status: 'Active' },
  { id: 41, person_id: 0, name: 'SHRIKANT SHARMA', salary: 7500, status: 'Active' },
  { id: 42, person_id: 0, name: 'RAJ KUMAR CHANDEL', salary: 7500, status: 'Active' },
  { id: 43, person_id: 0, name: 'RAJESH SHARMA DRIVER', salary: 10000, status: 'Active' },
  // { id: 44, person_id: 0, name: 'BHANU PRATAP GUARD', salary: 10000, status: 'Active' },
  // { id: 45, person_id: 0, name: 'SUNIL YADAV GUARD', salary: 10000, status: 'Active' },
  // { id: 46, person_id: 0, name: 'N P PARASHAR/PAWAN SINGH', salary: 10000, status: 'Active' },
  // { id: 47, person_id: 0, name: 'DEVNARAYAN SINGH/PAWAN', salary: 10000, status: 'Active' },
  // { id: 48, person_id: 0, name: 'SONU SHAKYA (NEW)', salary: 10000, status: 'Active' },
  { id: 49, person_id: 0, name: 'BELVAN', salary: 7000, status: 'Active' },
];


// Function to migrate data
const migrateData = async () => {
  try {
    for (let labour of labourData) {
      const newEmployee = new EmployeeModel({
        name: labour.name,
        salary: labour.salary,
        personId: labour.person_id,
        status: labour.status,
        empType: 'labour', // Assuming all are labour
        sqlId:labour.id
      });

      await newEmployee.save();
      console.log(`Added ${labour.name}`);
    }

    console.log('Data migration complete');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error during migration:', error);
    mongoose.connection.close();
  }
};

// Call the migration function
migrateData();