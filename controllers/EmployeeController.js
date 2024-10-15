import { Employee } from '../models/Employee.js';
import bcrypt from 'bcrypt';

const Admin_Emails = ["mauryapravesh67@gmail.com", "gaumms@gmail.com", "hemangisharma316@gmail.com"];
const Admin_Default_Password = "gaummsadmin";
const Staff_Default_Password = "gaumms";

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


// Login Employee Controller (Improved)
export const loginEmployee = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Admin Login Logic
        if (role === 'admin' && Admin_Emails.includes(email)) {
            if (password === Admin_Default_Password) {
                return res.status(200).json({
                    message: 'Login successful as admin',
                    user: { email, role: 'admin', name: 'Admin User' } // Example admin data
                });
            } else {
                return res.status(401).json({ message: 'Invalid password for admin' });
            }
        }

        // Staff Login Logic
        const employee = await Employee.findOne({ 'personalDetails.email': email });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        if (role === 'staff') {
            if (password === Staff_Default_Password) {
                return res.status(200).json({ 
                    message: 'Login successful as staff', 
                    employee 
                });
            } else {
                return res.status(401).json({ message: 'Invalid password for staff' });
            }
        }

        // If role doesn't match or invalid credentials provided
        res.status(403).json({ message: 'Unauthorized role or invalid credentials' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error during login', error: error.message });
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

export const deleteEmployee = async (req, res) => {
    const { id } = req.params;
  
    try {
      const employee = await Employee.findByIdAndDelete(id);
      
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
    //   await employee.remove();
      res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
      console.error('Error deleting employee:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };