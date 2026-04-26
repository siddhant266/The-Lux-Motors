require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const carsRouter     = require('./routes/cars');
const authRouter     = require('./routes/auth');
const bookingsRouter = require('./routes/bookings');

const app  = express();
const PORT = process.env.PORT || 5000;

// Explicit CORS headers for Render deployment
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(express.json());

// Routes
app.use('/api/cars',     carsRouter);
app.use('/api/auth',     authRouter);
app.use('/api/bookings', bookingsRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// DB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(PORT, () =>
            console.log(`🚀 Server running on http://localhost:${PORT}`)
        );
    })
    .catch(err => {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1);
    });