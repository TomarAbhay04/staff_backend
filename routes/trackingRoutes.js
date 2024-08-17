import express from 'express';
import { saveTrackingData, getTrackingData } from '../controllers/trackingController.js';

const router = express.Router();

// Route to save tracking data
router.post('/track', saveTrackingData);

// Route to fetch tracking data
router.get('/track', getTrackingData);

export default router;
