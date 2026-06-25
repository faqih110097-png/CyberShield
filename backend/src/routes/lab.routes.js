const express = require('express');
const router = express.Router();
const {
  getVulnerabilities,
  getVulnerability,
  toggleVulnerability,
  testAuthWeakness,
  testInputValidation,
  testAccessControl,
  testSessionHandling,
  submitFeedback,
  submitContact,
} = require('../controllers/lab.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All lab routes require authentication
router.use(protect);

// Get all vulnerabilities
router.get('/', getVulnerabilities);

// Lab test endpoints (must be registered BEFORE /:id route)
router.post('/auth-weakness', testAuthWeakness);
router.post('/input-validation', testInputValidation);
router.get('/access-control', testAccessControl);
router.post('/session-handling', testSessionHandling);

// Get single vulnerability
router.get('/:id', getVulnerability);

// Toggle vulnerability (Admin only)
router.put('/:id/toggle', authorize('admin'), toggleVulnerability);


// Feedback and contact endpoints
router.post('/feedback', submitFeedback);
router.post('/contact', submitContact);

module.exports = router;

