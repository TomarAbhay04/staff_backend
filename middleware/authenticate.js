import jwt from 'jsonwebtoken';
import { Employee } from '../models/Employee.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

  if (!token) return res.status(403).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Employee.findById(decoded.id).select('employeeId isAdmin role'); // Adjust based on your user schema
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Failed to authenticate token' });
  }
};
