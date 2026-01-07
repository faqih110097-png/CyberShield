const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getReports,
  getReport,
  getAllReports,
  getReportStats,
  deleteReport,
  getAllLogs,
} = require('../controllers/report.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All report routes require authentication
router.use(protect);

// Get user's reports
router.get('/', getReports);

// Get report statistics
router.get('/stats', getReportStats);

// Get all reports (Admin only)
router.get('/all', authorize('admin'), getAllReports);

// Get all logs (Admin only)
router.get('/logs', authorize('admin'), getAllLogs);

// Get all users (for data exposure vulnerability - no role check)
router.get('/users', getAllUsers);

// Get single report
router.get('/:id', getReport);

// Delete report
router.delete('/:id', deleteReport);

module.exports = router;

