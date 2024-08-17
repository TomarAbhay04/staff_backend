import { Attendance } from '../models/Attendance.js';
import { Employee } from '../models/Employee.js';

export const recordAttendance = async (req, res) => {
  const { employeeId, time, lat, lng, value } = req.body;
  const date = new Date().toISOString().split('T')[0]; // current date in YYYY-MM-DD format

  console.log('recordAttendance called');
  console.log('Request body:', req.body);

  try {
    const employee = await Employee.findOne({ 'personalDetails.email': employeeId });
    console.log('Employee:', employee);
    if (!employee) {
      console.log('Employee not found');
      return res.status(404).send('Employee not found');
    }

    let attendance = await Attendance.findOne({ employee: employee.email, date });

    if (!attendance) {
      attendance = new Attendance({ employee: employee._id, date, times: [] });
    }

    attendance.times.push({ time, location: { lat, lng }, value });
    await attendance.save();
    console.log('Attendance recorded');
    res.status(200).send('Attendance recorded');
  } catch (error) {
    console.log('Server error:', error);
    res.status(500).send('Server error');
  }
};

export const getAttendance = async (req, res) => {
  const { employeeId, date } = req.params;

  console.log('getAttendance called');
  console.log('Request params:', req.params);

  try {
    const employee = await Employee.findOne({ 'companyDetails.employeeId': employeeId });
    if (!employee) {
      console.log('Employee not found');
      return res.status(404).send('Employee not found');
    }

    const attendance = await Attendance.findOne({ employee: employee._id, date }).populate('employee');

    if (!attendance) {
      console.log('No records found');
      return res.status(404).send('No records found');
    }

    console.log('Attendance record found');
    res.status(200).json(attendance);
  } catch (error) {
    console.log('Server error:', error);
    res.status(500).send('Server error');
  }
};
