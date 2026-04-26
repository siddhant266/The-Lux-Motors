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

const requireAuth = require('../middleware/auth');

// POST /api/cars
router.post('/', requireAuth, async (req, res) => {
    try {
        const newCar = new Car(req.body);
        const savedCar = await newCar.save();
        res.status(201).json(savedCar);
    } catch (err) {
        console.error('[POST /api/cars]', err.message);
        res.status(500).json({ error: 'Failed to create car' });
    }
});

// PUT /api/cars/:id
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCar) return res.status(404).json({ error: 'Car not found' });
        res.json(updatedCar);
    } catch (err) {
        console.error('[PUT /api/cars/:id]', err.message);
        res.status(500).json({ error: 'Failed to update car' });
    }
});

// DELETE /api/cars/:id
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const deletedCar = await Car.findByIdAndDelete(req.params.id);
        if (!deletedCar) return res.status(404).json({ error: 'Car not found' });
        res.json({ message: 'Car deleted successfully' });
    } catch (err) {
        console.error('[DELETE /api/cars/:id]', err.message);
        res.status(500).json({ error: 'Failed to delete car' });
    }
});

module.exports = router;