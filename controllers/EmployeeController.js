import { Employee } from '../models/Employee.js';

// Add new employee
export const addEmployee = async (req, res) => {
    try {
        const employee = new Employee(req.body);
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
        const { email } = req.params;
        const employee = await Employee.findOne({ 'personalDetails.email': email });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json({ message: 'Employee verified', employee });
    } catch (error) {
        console.error('Error verifying employee email:', error);
        res.status(500).json({ message: 'Error verifying employee email', error: error.message });
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
export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
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
