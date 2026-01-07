const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vulnerability: {
    type: String,
    required: true,
  },
  requestData: {
    type: mongoose.Schema.Types.Mixed,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  riskScore: {
    type: Number,
    required: true,
  },
  flagged: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
  },
  detectedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Log', logSchema);
