// models/Task.js
import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  taskName: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date, required: true },
  steps: [
    {
      stepDescription: { type: String, required: true },
      isCompleted: { type: Boolean, default: false },
    },
  ],
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
});

const Task = mongoose.model('Task', TaskSchema);

export { Task };
