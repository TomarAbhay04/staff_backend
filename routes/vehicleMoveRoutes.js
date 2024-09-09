import express from 'express';
import { createVehicleMoveData, getAllVehicleMoveData } from '../controllers/vehicleMoveController.js';

const router = express.Router();

// Route to create VehicleMoveData
router.post('/vehicle-move', createVehicleMoveData);

// Route to fetch all VehicleMoveData
router.get('/vehicle-move', getAllVehicleMoveData);

export default router;
