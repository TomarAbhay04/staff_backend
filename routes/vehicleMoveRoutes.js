import express from 'express';
import { 
    createVehicleMoveData, 
    getAllVehicleMoveDataForAdmin, 
    getVehicleMoveDataForEmployee,
    updateVehicleMoveData,
    deleteVehicleMoveData 
} from '../controllers/vehicleMoveController.js';
// import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Route to create VehicleMoveData
router.post('/vehicle-move', createVehicleMoveData);

// Admin routes
router.get('/admin/vehicle-move', getAllVehicleMoveDataForAdmin);

// Employee routes
router.get('/vehicle-move/:employeeId', getVehicleMoveDataForEmployee);


// Route to update VehicleMoveData (both employee and admin)
router.patch('/vehicle-move/:id', updateVehicleMoveData);

// Route to delete VehicleMoveData (both employee and admin)
router.delete('/vehicle-move/:id', deleteVehicleMoveData);

export default router;
