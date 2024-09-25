import { Attendance } from '../models/Attendance.js';
import { Employee } from '../models/Employee.js';
import cron from 'node-cron';
import mongoose from 'mongoose';

// Upload attendance with pending status
// export const uploadAttendance = async (req, res) => {
//   try {
//     const { employeeId, date, period, time, lat, lng, address } = req.body;
//     console.log('Received data:', { employeeId, date, period, time, lat, lng, address });

//     const employee = await Employee.findById(employeeId);
//     if (!employee) {
//       console.error('Employee not found:', employeeId);
//       return res.status(404).json({ error: 'Employee not found' });
//     }

//     // Check for existing attendance for the given employee, date, and period
//     const existingAttendance = await Attendance.findOne({ employeeId, date, period });
//     if (existingAttendance) {
//       console.error('Attendance already exists for this period:', { employeeId, date, period });
//       return res.status(400).json({ error: `Attendance for ${period} period is already uploaded for today` });
//     }

//     const newAttendance = new Attendance({
//       employeeId,
//       date,
//       period,
//       time,
//       lat,
//       lng,
//       address,
//       status: 'Pending',
//     });

//     await newAttendance.save();
//     console.log('Attendance uploaded successfully:', newAttendance);
//     return res.status(200).json({ message: 'Attendance uploaded successfully' });
//   } catch (err) {
//     console.error('Error uploading attendance:', err);
//     return res.status(500).json({ error: 'Error uploading attendance' });
//   }
// };

// Upload attendance with pending status
export const uploadAttendance = async (req, res) => {
  try {
    const { employeeId, date, period, time, lat, lng, address } = req.body;
    console.log('Received data:', { employeeId, date, period, time, lat, lng, address });

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      console.error('Employee not found:', employeeId);
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Check if the current date matches the date in the request body
    const today = new Date().toISOString().split('T')[0];
    if (date !== today) {
      return res.status(400).json({ error: 'Attendance can only be uploaded for the current date' });
    }

    // Check for existing attendance for the given employee, date, and period
    const existingAttendance = await Attendance.findOne({ employeeId, date, period });
    if (existingAttendance) {
      console.error('Attendance already exists for this period:', { employeeId, date, period });
      return res.status(400).json({ error: `Attendance for period ${period} is already uploaded for today` });
    }

    // Check if this is the first attendance of the day
    const firstAttendance = await Attendance.findOne({ employeeId, date }).sort({ time: 1 });

    if (firstAttendance) {
      // First attendance of the day exists, calculate the time difference
      const firstUploadTime = new Date(`${date}T${firstAttendance.time}`);
      const currentTime = new Date(`${date}T${time}`);
      const timeDifference = (currentTime - firstUploadTime) / (1000 * 60 * 60); // Time difference in hours

      // Allow further periods to be uploaded within 12 hours of the first upload
      if (timeDifference > 12) {
        return res.status(400).json({ error: 'Attendance for the remaining periods must be uploaded within 12 hours of the first upload.' });
      }
    }

    const newAttendance = new Attendance({
      employeeId,
      date,
      period,
      time,
      lat,
      lng,
      address,
      status: 'Pending',
    });

    await newAttendance.save();
    console.log('Attendance uploaded successfully:', newAttendance);

    return res.status(200).json({ message: 'Attendance uploaded successfully' });
  } catch (err) {
    console.error('Error uploading attendance:', err);
    return res.status(500).json({ error: 'Error uploading attendance' });
  }
};

// Evaluate attendance status for an individual employee on a specific date
export const evaluateAttendanceStatusForEmployee = async (employeeId, date) => {
  try {
    const attendances = await Attendance.find({ employeeId, date });
    const periods = attendances.map(a => a.period);

    let status = 'Absent';
    if (periods.length >= 3) {
      status = 'Present';
    } else if (periods.length === 2) {
      status = 'Half Day';
    }

    // Update the status for all attendance records of the employee for the day
    await Attendance.updateMany({ employeeId, date }, { $set: { status } });
    console.log(`Attendance status for employee ${employeeId} on ${date} updated to ${status}`);
  } catch (error) {
    console.log('Error evaluating attendance status for employee:', error);
  }
};

// Evaluate attendance status for all employees at the end of the day
export const evaluateAttendanceStatus = async () => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  try {
    const attendances = await Attendance.aggregate([
      {
        $match: { date: today }
      },
      {
        $group: {
          _id: '$employeeId',
          periods: { $addToSet: '$period' }
        }
      }
    ]);

    for (const attendance of attendances) {
      const employeeId = attendance._id;
      await evaluateAttendanceStatusForEmployee(employeeId, today);
    }

    // Handle employees who didn't upload attendance at all
    const absentEmployees = await Employee.find({
      _id: { $nin: attendances.map(a => a._id) }
    });

    for (const employee of absentEmployees) {
      await Attendance.create({
        employeeId: employee._id,
        date: today,
        period: 'N/A',
        time: '00:00:00',
        lat: 0,
        lng: 0,
        address: 'No attendance recorded',
        status: 'Absent',
      });
    }

    console.log('Attendance status evaluated for the day.');
  } catch (error) {
    console.log('Error evaluating attendance status:', error);
  }
};

// Schedule the evaluation task to run daily at 3:02 AM
cron.schedule('2 3 * * *', () => {
  console.log('Evaluating attendance status...');
  evaluateAttendanceStatus();
});

export const getAttendanceByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const start = new Date(startDate).toISOString().split('T')[0];
    const end = endDate ? new Date(endDate).toISOString().split('T')[0] : start;

    const attendanceRecords = await Attendance.find({
      date: { $gte: start, $lte: end },
    })
    .populate({
      path: 'employeeId',
      select: 'personalDetails.name', // Only select the employee's name
    });

    if (attendanceRecords.length === 0) {
      return res.status(200).json({ message: 'No attendance records found for this date range.' });
    }

    // Return the attendance records with populated employee names
    res.status(200).json(attendanceRecords);
  } catch (err) {
    console.error('Error retrieving attendance records:', err);
    res.status(500).json({ error: 'Error retrieving attendance records' });
  }
};


export const getAvailablePeriods = async (req, res) => {
  try {
    const { employeeId } = req.query;

    console.log('Fetching available periods for employeeId:', employeeId);

    // Fetch all periods uploaded by the employee for today
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    console.log('Today\'s date:', today);

    const uploadedAttendance = await Attendance.find({ employeeId, date: today });
    console.log('Uploaded attendance for today:', uploadedAttendance);

    // Define all periods
    const periods = ['first', 'second', 'third', 'fourth'];

    // Determine which period is next based on uploaded data
    const uploadedPeriods = uploadedAttendance.map((attendance) => attendance.period);
    console.log('Uploaded periods:', uploadedPeriods);

    const nextAvailablePeriod = periods.find((period) => !uploadedPeriods.includes(period));
    console.log('Next available period:', nextAvailablePeriod);

    // If no period is available, the day is complete
    if (!nextAvailablePeriod) {
      console.log('All periods have been uploaded for today.');
      return res.status(200).json({
        availablePeriods: [],
        message: 'All periods have been uploaded for today.',
      });
    }

    return res.status(200).json({
      availablePeriods: [nextAvailablePeriod],
    });
  } catch (error) {
    console.error('Error fetching available periods:', error.message);
    return res.status(500).json({
      message: 'Error fetching available periods',
      error: error.message,
    });
  }
};


export const checkAttendance = async (req, res) => {
  try {
    const { employeeId, date, period } = req.body; // Fixed typo from req.boyd to req.body

    // Fetch attendance for the specific employee, date, and period
    const attendanceRecord = await Attendance.findOne({
      employeeId: mongoose.Types.ObjectId(employeeId),
      date,
      period,
    });

    if (attendanceRecord) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (err) {
    console.error('Error fetching attendance records:', err);
    return res.status(500).json({ error: 'Error fetching attendance records', details: err.message });
  }
};


export const getAttendanceByMonthAndYear = async (req, res) => {
  try {
    const { employeeId, month, year } = req.body;

    // Construct the start and end date range for the specified month and year
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); // Last day of the month

    // Fetch attendance records for the given employee, month, and year
    const attendanceRecords = await Attendance.find({
      employeeId: new mongoose.Types.ObjectId(employeeId), // Use 'new' keyword for ObjectId
      date: {
        $gte: startDate.toISOString().split('T')[0], // Starting date of the month
        $lte: endDate.toISOString().split('T')[0] // Ending date of the month
      }
    });

    // Check if any attendance records were found
    if (attendanceRecords.length === 0) {
      return res.status(200).json({ message: 'No attendance records found for this month.' });
    }

    // Return the fetched attendance records
    res.status(200).json(attendanceRecords);
  } catch (err) {
    console.error('Error retrieving attendance records for month and year:', err);
    res.status(500).json({ error: 'Error retrieving attendance records for month and year' });
  }
};