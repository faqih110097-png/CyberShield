// Quick test script to verify backend setup
require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGO_URI:', process.env.MONGO_URI || 'mongodb://localhost:27017/cybershield');
    
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/cybershield';
    await mongoose.connect(uri);
    
    console.log('✅ MongoDB connected successfully!');
    console.log('Database:', mongoose.connection.name);
    
    // Test User model
    const User = require('./src/models/User');
    const userCount = await User.countDocuments();
    console.log(`✅ User model works! Total users: ${userCount}`);
    
    await mongoose.connection.close();
    console.log('✅ Connection test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection test failed:');
    console.error(error.message);
    console.error('\nPlease check:');
    console.error('1. MongoDB is running (local or Atlas)');
    console.error('2. .env file exists with correct MONGO_URI');
    console.error('3. Network connectivity');
    process.exit(1);
  }
}

testConnection();

