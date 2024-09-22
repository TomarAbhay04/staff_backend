import { Employee } from '../models/Employee.js';
// import jwt from 'jsonwebtoken';

// Add new employee
// export const addEmployee = async (req, res) => {
//     try {
//         const { personalDetails, companyDetails, financialDetails } = JSON.parse(req.body.data);

//         // If a photo is uploaded, update the photo field
//         if (req.file) {
//             personalDetails.photo = req.file.path; // Store the path of the uploaded photo
//         }

//         const employee = new Employee({
//             personalDetails,
//             companyDetails,
//             financialDetails
//         });

//         await employee.save();
//         res.status(201).json({ message: 'Employee added successfully', employee });
//     } catch (error) {
//         console.error('Error adding employee:', error);
//         res.status(400).json({ message: 'Error adding employee', error: error.message });
//     }
// };

export const addEmployee = async (req, res) => {
    try {
        // Directly access the employee data from req.body
        const { personalDetails, companyDetails, financialDetails } = req.body;

        // Check if all required details are provided
        if (!personalDetails || !companyDetails || !financialDetails) {
            return res.status(400).json({ message: "Required employee details are missing" });
        }

        // Create a new employee instance
        const employee = new Employee({
            personalDetails,  // Use the object directly
            companyDetails,   // Use the object directly
            financialDetails  // Use the object directly
        });

        // Save the employee to the database
        await employee.save();
        res.status(201).json({ message: 'Employee added successfully', employee });
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(400).json({ message: 'Error adding employee', error: error.message });
    }
};

// Get all employees
export const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({}, 'personalDetails.name personalDetails.email');
        res.status(200).json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Error fetching employees', error: error.message });
    }
};

// Get employee by ID
export const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(employee);
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ message: 'Error fetching employee', error: error.message });
    }
};

// Verify employee email
export const verifyEmployeeEmail = async (req, res) => {
    try {
        const { email } = req.params; // Get email from frontend
    
        // Check if email exists in the database
        const employee = await Employee.findOne({ 'personalDetails.email': email });
    
        if (!employee) {
          return res.status(404).json({ message: 'Employee not found' });
        }
    
        // Generate JWT token
        // const token = jwt.sign(
        //   { id: employee._id, email: employee.personalDetails.email, role: employee.role },
        //   process.env.JWT_SECRET,
        //   { expiresIn: '1h' } // Token expires in 1 hour
        // );
    
        res.status(200).json({ message: 'Login successful', employee });
      } catch (error) {
        console.error('Error during Google sign-in:', error);
        res.status(500).json({ message: 'Error during Google sign-in', error: error.message });
      }
    };


export const getEmployeeByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const employee = await Employee.findOne({ 'personalDetails.email': email });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(employee);
    } catch (error) {
        console.error('Error fetching employee by email:', error);
        res.status(500).json({ message: 'Error fetching employee by email', error: error.message });
    }
};

// Update employee data
// Update employee data
export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        // Parse JSON data from the request
        const updatedData = JSON.parse(req.body.data);
        console.log('updatedData:', updatedData);
        
        // If a photo is uploaded, update the photo field
        if (req.file) {
            updatedData.personalDetails.photo = req.file.path; // Store the path of the uploaded photo
        }

        // Update the employee in the database
        const employee = await Employee.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee updated successfully', employee });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
};