const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

const router = express.Router();

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const match = await user.comparePassword(password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user._id, email: user.email, name: user.name, role: user.role },
        });
    } catch (err) {
        console.error('[POST /api/auth/login]', err.message);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

// ── POST /api/auth/seed-admin ─────────────────────────────────────────────────
// One-time route to create the first admin user (disable after use)
router.post('/seed-admin', async (req, res) => {
    try {
        const existing = await User.findOne({ email: 'admin@thelux.com' });
        if (existing) {
            return res.json({ message: 'Admin already exists.' });
        }
        const admin = await User.create({
            email: 'admin@thelux.com',
            password: 'thelux2024',
            name: 'Admin',
            role: 'admin',
        });
        res.json({ message: 'Admin created.', email: admin.email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
