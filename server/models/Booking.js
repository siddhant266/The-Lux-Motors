const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name:             { type: String, required: true, trim: true },
    phone:            { type: String, required: true, trim: true },
    preferredVehicle: { type: String, default: '' },
    message:          { type: String, default: '' },
    status:           {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending',
    },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
