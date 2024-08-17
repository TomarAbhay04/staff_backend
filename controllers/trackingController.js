import Tracking from '../models/Tracking.js';

// Function to save tracking data
export const saveTrackingData = async (req, res) => {
    try {
        // Validate and structure the incoming data
        const { employeeId, date, time, lat, lng, address } = req.body;

        if (!employeeId || !date || !time || !lat || !lng || !address) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const trackingData = new Tracking({
            employeeId,
            date,
            time,
            lat,
            lng,
            address
        });

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
        const query = {};
        if (employeeId) query.employeeId = employeeId;
        if (date) query.date = date;

        const data = await Tracking.find(query);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching tracking data', error: err });
    }
};
