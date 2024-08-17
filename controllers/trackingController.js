import Tracking from '../models/Tracking.js';

// Function to save tracking data
export const saveTrackingData = async (req, res) => {
    try {
        const trackingData = new Tracking(req.body);
        await trackingData.save();
        res.status(200).json({ message: 'Tracking data recorded successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error recording tracking data', error: err });
    }
};

// Function to fetch tracking data (e.g., for a specific day or employee)
export const getTrackingData = async (req, res) => {
    const { employeeId, date } = req.query;

    try {
        const data = await Tracking.find({ employeeId, date });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching tracking data', error: err });
    }
};
