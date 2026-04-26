const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// GET  
router.get('/', async (req, res) => {
    try {
        const filter = {};

        if (req.query.featured === 'true') filter.is_featured = true;
        if (req.query.category) {
            filter.category = { $regex: new RegExp(`^${req.query.category}$`, 'i') };
        }
        const limit = parseInt(req.query.limit) || 0;
        filter.images = { $exists: true, $ne: [] };

        const cars = await Car.find(filter).limit(limit).lean();

        res.json(cars);
    } catch (err) {
        console.error('[GET /api/cars]', err.message);
        res.status(500).json({ error: 'Failed to fetch cars' });
    }
});

// GET /api/cars/:id
router.get('/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id).lean();
        if (!car) return res.status(404).json({ error: 'Car not found' });

        res.json(car);
    } catch (err) {
        console.error('[GET /api/cars/:id]', err.message);
        res.status(500).json({ error: 'Failed to fetch car' });
    }
});

module.exports = router;