import express from 'express';
import { uploadAttendance, getAttendanceByDateRange, checkAttendance, getAttendanceByMonthAndYear, getAvailablePeriods} from '../controllers/attendanceController.js';

const router = express.Router();

// Route to upload attendance
router.post('/upload', uploadAttendance);

// Route to get attendance status
// router.get('/checkAttendance', getAttendanceByDateRange);

router.post('/getAttendanceByDateRange', getAttendanceByDateRange);

router.get('/checkAttendance', checkAttendance);

// Route to get attendance records for a specific month and year
router.post('/getAttendanceByMonthAndYear', getAttendanceByMonthAndYear);

// Route to get available periods
router.get('/getAvailablePeriods', getAvailablePeriods);

export default router;
