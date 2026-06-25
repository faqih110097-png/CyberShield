const mongoose = require('mongoose');
const Vulnerability = require('../models/Vulnerability');
require('dotenv').config();

const vulnerabilities = [
  {
    name: 'Authentication Weakness',
    category: 'Authentication',
    enabled: true,
    severity: 'High',
    description: 'Simulates weak authentication mechanisms and password handling vulnerabilities.',
  },
  {
    name: 'Input Validation',
    category: 'Input Validation',
    enabled: true,
    severity: 'Medium',
    description: 'Demonstrates insufficient input validation and sanitization issues.',
  },
  {
    name: 'Access Control',
    category: 'Access Control',
    enabled: true,
    severity: 'Critical',
    description: 'Shows improper access control and authorization bypass techniques.',
  },
  {
    name: 'Session Handling',
    category: 'Session Handling',
    enabled: false,
    severity: 'Medium',
    description: 'Illustrates weak session management and token handling vulnerabilities.',
  },
];

const seedVulnerabilities = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cybershield');

    console.log('Connected to MongoDB');

    // Clear existing vulnerabilities
    await Vulnerability.deleteMany({});
    console.log('Cleared existing vulnerabilities');

    // Insert new vulnerabilities
    await Vulnerability.insertMany(vulnerabilities);
    console.log('Seeded vulnerabilities:', vulnerabilities.length);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedVulnerabilities();