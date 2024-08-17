import mongoose from 'mongoose';

const trackingSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: '30d' } } // TTL index to auto-delete after 30 days
}, { timestamps: true });

const Tracking = mongoose.model('Tracking', trackingSchema);

export default Tracking;
