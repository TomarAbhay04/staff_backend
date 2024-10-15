import express from 'express';
import upload from '../multerConfig.js'; // Import multer configuration
import {
    addEmployee,
    getAllEmployees,
    getEmployeeById,
    verifyEmployeeEmail,
    getEmployeeByEmail,
    updateEmployee,
    deleteEmployee,
    loginEmployee,
} from '../controllers/EmployeeController.js';

const router = express.Router();

// Use multer middleware to handle file upload for addEmployee and updateEmployee routes
router.post('/add', upload.single('photo'), addEmployee);
router.delete('/:id', deleteEmployee);
router.put('/:id', upload.single('photo'), updateEmployee);
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/login', loginEmployee);
router.get('/verify/:email', verifyEmployeeEmail);
router.get('/email/:email', getEmployeeByEmail);

export default router;
