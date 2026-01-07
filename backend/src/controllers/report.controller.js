const Report = require('../models/Report');
const User = require('../models/User');
const Log = require('../models/Log');

// @desc    Get all users (for data exposure vulnerability)
// @route   GET /api/reports/users
// @access  Private (no role check for vulnerability)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Return all user data except password
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all reports for current user
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id })
      .sort({ detectedAt: -1 })
      .limit(100);

    res.json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user owns this report or is admin
    if (report.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this report' });
    }

    res.json(report);
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all reports (Admin only)
// @route   GET /api/reports/all
// @access  Private/Admin
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('userId', 'name email')
      .sort({ detectedAt: -1 })
      .limit(500);

    res.json(reports);
  } catch (error) {
    console.error('Get all reports error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get reports statistics
// @route   GET /api/reports/stats
// @access  Private
const getReportStats = async (req, res) => {
  try {
    const userId = req.user.role === 'admin' ? null : req.user._id;
    const query = userId ? { userId } : {};

    const totalReports = await Report.countDocuments(query);
    const flaggedReports = await Report.countDocuments({ ...query, flagged: true });

    // Get reports by vulnerability type
    const vulnerabilityStats = await Report.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$vulnerability',
          count: { $sum: 1 },
          avgRiskScore: { $avg: '$riskScore' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get risk score distribution
    const riskDistribution = await Report.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lt: ['$riskScore', 30] }, then: 'Low (0-29)' },
                { case: { $lt: ['$riskScore', 60] }, then: 'Medium (30-59)' },
                { case: { $lt: ['$riskScore', 80] }, then: 'High (60-79)' },
                { case: { $gte: ['$riskScore', 80] }, then: 'Critical (80-100)' },
              ],
              default: 'Unknown',
            },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalReports,
      flaggedReports,
      vulnerabilityStats,
      riskDistribution,
    });
  } catch (error) {
    console.error('Get report stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if user owns this report or is admin
    if (report.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this report' });
    }

    await Report.findByIdAndDelete(req.params.id);

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all logs (Admin only)
// @route   GET /api/reports/logs
// @access  Private/Admin
const getAllLogs = async (req, res) => {
  try {
    const { date, ip, endpoint } = req.query;
    let query = {};

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.detectedAt = { $gte: startDate, $lt: endDate };
    }

    if (ip) {
      query.ipAddress = ip;
    }

    if (endpoint) {
      query.endpoint = { $regex: endpoint, $options: 'i' };
    }

    const logs = await Log.find(query)
      .populate('userId', 'name email')
      .sort({ detectedAt: -1 })
      .limit(1000);

    res.json(logs);
  } catch (error) {
    console.error('Get all logs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getReports,
  getReport,
  getAllReports,
  getReportStats,
  deleteReport,
  getAllLogs,
};

