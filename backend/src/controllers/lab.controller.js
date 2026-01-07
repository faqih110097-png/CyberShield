const Vulnerability = require('../models/Vulnerability');
const Report = require('../models/Report');
const Feedback = require('../models/Feedback');
const Contact = require('../models/Contact');

// @desc    Get all vulnerabilities
// @route   GET /api/labs
// @access  Private
const getVulnerabilities = async (req, res) => {
  try {
    const vulnerabilities = await Vulnerability.find().sort({ createdAt: -1 });
    res.json(vulnerabilities);
  } catch (error) {
    console.error('Get vulnerabilities error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single vulnerability
// @route   GET /api/labs/:id
// @access  Private
const getVulnerability = async (req, res) => {
  try {
    const vulnerability = await Vulnerability.findById(req.params.id);

    if (!vulnerability) {
      return res.status(404).json({ message: 'Vulnerability not found' });
    }

    res.json(vulnerability);
  } catch (error) {
    console.error('Get vulnerability error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Enable/Disable vulnerability (Admin only)
// @route   PUT /api/labs/:id/toggle
// @access  Private/Admin
const toggleVulnerability = async (req, res) => {
  try {
    const vulnerability = await Vulnerability.findById(req.params.id);

    if (!vulnerability) {
      return res.status(404).json({ message: 'Vulnerability not found' });
    }

    vulnerability.enabled = !vulnerability.enabled;
    await vulnerability.save();

    res.json({
      message: `Vulnerability ${vulnerability.enabled ? 'enabled' : 'disabled'}`,
      vulnerability,
    });
  } catch (error) {
    console.error('Toggle vulnerability error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Test Authentication Weakness Lab
// @route   POST /api/labs/auth-weakness
// @access  Private
const testAuthWeakness = async (req, res) => {
  try {
    const { email, password } = req.body;
    const vulnerability = await Vulnerability.findOne({ name: 'Authentication Weakness' });

    if (!vulnerability || !vulnerability.enabled) {
      return res.status(403).json({
        message: 'This lab is currently disabled. Please contact an admin to enable it.',
      });
    }

    // Simulate weak authentication logic
    // In a real vulnerability, this would use weak comparison or no hashing
    // Here we simulate it by checking if password matches email (weak logic)
    if (vulnerability.enabled) {
      // Weak logic: accept if password equals email (obviously insecure)
      const isWeakMatch = password === email;

      if (isWeakMatch) {
        // Log this as suspicious activity
        await Report.create({
          userId: req.user._id,
          vulnerability: 'Authentication Weakness',
          requestData: { email, password: '***' },
          ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
          endpoint: '/api/labs/auth-weakness',
          riskScore: 80,
          flagged: true,
          description: 'Weak authentication pattern detected',
        });

        return res.json({
          success: true,
          message: 'Lab test completed - Weak authentication pattern detected!',
          vulnerability: 'Authentication Weakness',
          riskLevel: 'High',
        });
      }
    }

    res.json({
      success: false,
      message: 'Authentication failed - Try different credentials',
    });
  } catch (error) {
    console.error('Auth weakness test error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Test Input Validation Lab
// @route   POST /api/labs/input-validation
// @access  Private
const testInputValidation = async (req, res) => {
  try {
    const { input } = req.body;
    const vulnerability = await Vulnerability.findOne({ name: 'Input Validation' });

    if (!vulnerability || !vulnerability.enabled) {
      return res.status(403).json({
        message: 'This lab is currently disabled. Please contact an admin to enable it.',
      });
    }

    // Simulate weak input validation
    // In a real vulnerability, this would not sanitize input properly
    if (vulnerability.enabled && input) {
      // Check for suspicious patterns
      const suspiciousPatterns = /<script|javascript:|onerror=/i.test(input);

      if (suspiciousPatterns) {
        // Log this as suspicious activity
        await Report.create({
          userId: req.user._id,
          vulnerability: 'Input Validation',
          requestData: { input },
          ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
          endpoint: '/api/labs/input-validation',
          riskScore: 70,
          flagged: true,
          description: 'Unvalidated input with suspicious patterns detected',
        });

        return res.json({
          success: true,
          message: 'Lab test completed - Unvalidated input detected!',
          vulnerability: 'Input Validation',
          riskLevel: 'Medium',
          output: `Input received: ${input} (Not sanitized)`,
        });
      }
    }

    res.json({
      success: false,
      message: 'Input validation passed - Try different input patterns',
    });
  } catch (error) {
    console.error('Input validation test error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Test Access Control Lab
// @route   GET /api/labs/access-control
// @access  Private
const testAccessControl = async (req, res) => {
  try {
    const vulnerability = await Vulnerability.findOne({ name: 'Access Control' });

    if (!vulnerability || !vulnerability.enabled) {
      return res.status(403).json({
        message: 'This lab is currently disabled. Please contact an admin to enable it.',
      });
    }

    // Simulate weak access control
    // In a real vulnerability, this would allow unauthorized access
    if (vulnerability.enabled) {
      const userRole = req.user.role;

      // Log access attempt
      await Report.create({
        userId: req.user._id,
        vulnerability: 'Access Control',
        requestData: { role: userRole, attemptedAccess: 'Admin Resources' },
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        endpoint: '/api/labs/access-control',
        riskScore: userRole !== 'admin' ? 90 : 30,
        flagged: userRole !== 'admin',
        description: `Access control test - User role: ${userRole}`,
      });

      return res.json({
        success: true,
        message: 'Lab test completed - Access control check performed!',
        vulnerability: 'Access Control',
        riskLevel: userRole !== 'admin' ? 'High' : 'Low',
        userRole,
        accessGranted: userRole === 'admin',
      });
    }

    res.json({
      success: false,
      message: 'Access control test failed',
    });
  } catch (error) {
    console.error('Access control test error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Test Session Handling Lab
// @route   POST /api/labs/session-handling
// @access  Private
const testSessionHandling = async (req, res) => {
  try {
    const { action } = req.body;
    const vulnerability = await Vulnerability.findOne({ name: 'Session Handling' });

    if (!vulnerability || !vulnerability.enabled) {
      return res.status(403).json({
        message: 'This lab is currently disabled. Please contact an admin to enable it.',
      });
    }

    // Simulate weak session handling
    if (vulnerability.enabled) {
      // Log session activity
      await Report.create({
        userId: req.user._id,
        vulnerability: 'Session Handling',
        requestData: { action, userId: req.user._id },
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        endpoint: '/api/labs/session-handling',
        riskScore: 60,
        flagged: true,
        description: `Session handling test - Action: ${action}`,
      });

      return res.json({
        success: true,
        message: 'Lab test completed - Session handling check performed!',
        vulnerability: 'Session Handling',
        riskLevel: 'Medium',
        sessionInfo: {
          userId: req.user._id,
          action,
          timestamp: new Date().toISOString(),
        },
      });
    }

    res.json({
      success: false,
      message: 'Session handling test failed',
    });
  } catch (error) {
    console.error('Session handling test error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Submit feedback
// @route   POST /api/labs/feedback
// @access  Private
const submitFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Weak design: Store data directly without validation or sanitization
    const feedback = new Feedback({
      name,
      email,
      message,
    });

    await feedback.save();

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback,
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Submit contact message
// @route   POST /api/labs/contact
// @access  Private
const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Weak design: Store data directly without validation or sanitization
    const contact = new Contact({
      name,
      email,
      message,
    });

    await contact.save();

    res.status(201).json({
      message: 'Contact message submitted successfully',
      contact,
    });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getVulnerabilities,
  getVulnerability,
  toggleVulnerability,
  testAuthWeakness,
  testInputValidation,
  testAccessControl,
  testSessionHandling,
  submitFeedback,
  submitContact,
};

