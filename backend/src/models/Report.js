const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vulnerability: {
    type: String,
    required: [true, 'Please provide vulnerability name'],
    trim: true,
  },
  requestData: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  ipAddress: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  detectedAt: {
    type: Date,
    default: Date.now,
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  flagged: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('Report', reportSchema);

