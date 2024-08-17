import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import EmployeeRoute from './routes/EmployeeRoute.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import trackingRoutes from './routes/trackingRoutes.js'; // Import tracking routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Connected…'))
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit process if database connection fails
    });

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/employees', EmployeeRoute);
app.use('/api', attendanceRoutes);
app.use('/api', trackingRoutes); // Use tracking routes

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
