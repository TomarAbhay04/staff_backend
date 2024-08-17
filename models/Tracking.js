import mongoose from 'mongoose';

const trackingSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
}, { timestamps: true });

const Tracking = mongoose.model('Tracking', trackingSchema);

export default Tracking;
