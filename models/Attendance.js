import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  times: [
    {
      time: { type: String, required: true },
      location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      },
      value: { type: String, enum: ['first', 'second', 'third', 'fourth'], required: true }
    }
  ]
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

export { Attendance };
