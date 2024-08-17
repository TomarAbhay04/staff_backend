import express from 'express';
import { recordAttendance, getAttendance } from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/attendance', (req, res) => {
  console.log('POST /attendance route hit');
  recordAttendance(req, res);
});

router.get('/attendance/:employeeId/:date', (req, res) => {
  console.log(`GET /attendance/${req.params.employeeId}/${req.params.date} route hit`);
  getAttendance(req, res);
});

export default router;
