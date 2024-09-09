import express from 'express';
import { createTask, getTasksByEmployee, updateTask, updateTaskStep } from '../controllers/taskController.js';

const router = express.Router();

// Route to create a new task
router.post('/tasks', createTask);

// Route to get tasks for a specific employee
router.get('/tasks/:employeeId', getTasksByEmployee);

// Route to update task progress (complete a step)
router.patch('/tasks/:taskId/steps/:stepIndex', updateTaskStep);

// Route to update the entire task, including status
router.patch('/tasks/:taskId', updateTask);

export default router;
