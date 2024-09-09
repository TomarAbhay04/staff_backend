// controllers/taskController.js
import { Task } from '../models/TaskSchema.js';

// Controller to create a new task
export const createTask = async (req, res) => {
  const { employeeId, taskName, description, deadline, steps } = req.body;
  try {
    const task = new Task({ employeeId, taskName, description, deadline, steps });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// Controller to get tasks for a specific employee
export const getTasksByEmployee = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const tasks = await Task.find({ employeeId });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Controller to update task progress (complete a step)
export const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { steps, status } = req.body;
  
  try {
      const task = await Task.findById(taskId);
      if (task) {
          if (steps) {
              task.steps = steps; // Update steps
          }
          if (status) {
              task.status = status; // Update status
          }
          await task.save();
          res.status(200).json(task);
      } else {
          res.status(404).json({ error: 'Task not found' });
      }
  } catch (err) {
      res.status(500).json({ error: 'Failed to update task' });
  }
};

// Controller to update task progress (complete a step)
export const updateTaskStep = async (req, res) => {
  const { taskId, stepIndex } = req.params;
  try {
      const task = await Task.findById(taskId);
      if (task) {
          task.steps[stepIndex].isCompleted = true;
          // Check if all steps are completed
          const allStepsCompleted = task.steps.every(step => step.isCompleted);
          if (allStepsCompleted) {
              task.status = 'Completed'; // Update status if all steps are completed
          }
          await task.save();
          res.status(200).json(task);
      } else {
          res.status(404).json({ error: 'Task not found' });
      }
  } catch (err) {
      res.status(500).json({ error: 'Failed to update task' });
  }
};