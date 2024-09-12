import express from 'express';
import { createVehicleMoveData, getAllVehicleMoveDataForAdmin, getVehicleMoveDataForEmployee } from '../controllers/vehicleMoveController.js';
// import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Route to create VehicleMoveData
router.post('/vehicle-move', createVehicleMoveData);

// Admin routes
router.get('/admin/vehicle-move', getAllVehicleMoveDataForAdmin);

// Employee routes
router.get('/vehicle-move/:employeeId', getVehicleMoveDataForEmployee);


export default router;
