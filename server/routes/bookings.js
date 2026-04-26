const express    = require('express');
const Booking    = require('../models/Booking');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// ── POST /api/bookings ────────────────────────────────────────────────────────
// Public — anyone can submit a test drive booking
router.post('/', async (req, res) => {
    const { name, phone, preferredVehicle, message } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ error: 'Name and phone number are required.' });
    }

    try {
        const booking = await Booking.create({ name, phone, preferredVehicle, message });
        res.status(201).json({ message: 'Booking received!', booking });
    } catch (err) {
        console.error('[POST /api/bookings]', err.message);
        res.status(500).json({ error: 'Failed to save booking.' });
    }
});

// ── GET /api/bookings ─────────────────────────────────────────────────────────
// Admin only — get all bookings (newest first)
router.get('/', requireAuth, async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
        res.json(bookings);
    } catch (err) {
        console.error('[GET /api/bookings]', err.message);
        res.status(500).json({ error: 'Failed to fetch bookings.' });
    }
});

// ── PATCH /api/bookings/:id/status ───────────────────────────────────────────
// Admin only — update status: pending | confirmed | cancelled
router.patch('/:id/status', requireAuth, async (req, res) => {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value.' });
    }
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!booking) return res.status(404).json({ error: 'Booking not found.' });
        res.json(booking);
    } catch (err) {
        console.error('[PATCH /api/bookings/:id/status]', err.message);
        res.status(500).json({ error: 'Failed to update booking.' });
    }
});

module.exports = router;
