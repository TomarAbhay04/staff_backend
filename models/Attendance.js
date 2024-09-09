import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  date: {
    type: String, // Storing date as YYYY-MM-DD
    required: true,
  },
  period: {
    type: String, // Possible values: 'first', 'second', 'third', 'fourth'
    required: true,
  },
  time: {
    type: String, // Storing time as HH:MM:SS
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Present', 'Half Day', 'Absent'],
    default: 'Pending', // Default status is 'Pending' until evaluation
  },
});

attendanceSchema.index({ employeeId: 1, date: 1, period: 1 }, { unique: true });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
