import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import EmployeeRoute from './routes/EmployeeRoute.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import vehicleMoveRoutes from './routes/vehicleMoveRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';  

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Connected…'))
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit process if database connection fails
    });

// Define API routes
app.use('/api/employees', EmployeeRoute);
app.use('/api', attendanceRoutes);  
app.use('/api', taskRoutes);
app.use('/api/members', memberRoutes);  // Specifically handle members API
app.use('/api', vehicleMoveRoutes);
app.use('/api', transactionRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle basic root request
app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
