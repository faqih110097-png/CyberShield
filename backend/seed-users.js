const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@cybershield.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Test User 1',
    email: 'user1@cybershield.com',
    password: 'user123',
    role: 'user',
  },
  {
    name: 'Test User 2',
    email: 'user2@cybershield.com',
    password: 'user123',
    role: 'user',
  },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cybershield');

    console.log('Connected to MongoDB');

    // Clear existing users except admin if exists
    await User.deleteMany({ email: { $ne: 'admin@cybershield.com' } });
    console.log('Cleared existing users');

    // Insert new users
    for (const userData of users) {
      const userExists = await User.findOne({ email: userData.email });
      if (!userExists) {
        await User.create(userData);
        console.log(`Created user: ${userData.email}`);
      }
    }

    console.log('Seeded users successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedUsers();
