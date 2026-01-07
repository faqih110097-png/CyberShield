const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Enable debug logging for misconfiguration
process.env.NODE_ENV = 'development';
console.log('Debug mode enabled - exposing sensitive information');

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment variables:', process.env); // Expose env vars for misconfiguration
});

