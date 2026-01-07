const express = require('express');
const cors = require('cors');
const loggerMiddleware = require('./middleware/logger.middleware');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for misconfiguration
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy for accurate IP addresses
app.set('trust proxy', true);

// Request logging middleware
app.use(loggerMiddleware);

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/labs', require('./routes/lab.routes'));
app.use('/api/reports', require('./routes/report.routes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CyberShield Lab API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler - verbose for misconfiguration
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message,
    stack: err.stack, // Expose stack trace for misconfiguration
    details: err // Expose full error object
  });
});

module.exports = app;

