import express from 'express';
import {
    addEmployee,
    getAllEmployees,
    getEmployeeById,
    verifyEmployeeEmail,
    getEmployeeByEmail,
    updateEmployee,
    
} from '../controllers/EmployeeController.js';

const router = express.Router();

router.post('/add', addEmployee);
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.get('/verify/:email', verifyEmployeeEmail);
router.get('/email/:email', getEmployeeByEmail);
router.put('/:id', updateEmployee);

export default router;
