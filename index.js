import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import EmployeeRoute from './routes/EmployeeRoute.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import memberRoutes from './routes/memberRoutes.js';
import vehicleMoveRoutes from './routes/vehicleMoveRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';  

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Connected…'))
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit process if database connection fails
    });

app.get('/', (req, res) => {
    res.send('Localhost from the staff dashboard!');
});

// Resolve __dirname using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../FRONTEND/dist')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/employees', EmployeeRoute);
app.use('/api', attendanceRoutes);  
app.use('/api', taskRoutes);
app.use('/api/members', memberRoutes);
app.use('/api', vehicleMoveRoutes);
app.use('/api', transactionRoutes);

// Handle client-side routing, return index.html for unmatched routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../FRONTEND/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// this is the index.js file

export default app;
