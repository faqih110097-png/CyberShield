const Log = require('../models/Log');

// Request logger middleware
const loggerMiddleware = async (req, res, next) => {
  // Skip logging for health check and static assets
  if (req.path === '/api/health' || req.path.startsWith('/static')) {
    return next();
  }

  const startTime = Date.now();
  const originalSend = res.send;

  // Override res.send to capture response
  res.send = function (data) {
    // Restore original send before calling
    res.send = originalSend;
    const duration = Date.now() - startTime;
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';

    // Log request details
    const logData = {
      method: req.method,
      path: req.path,
      ip: ipAddress,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      statusCode: res.statusCode,
    };

    // Log to console
    console.log(`[${logData.timestamp}] ${logData.method} ${logData.path} - ${logData.statusCode} - ${logData.duration} - IP: ${logData.ip}`);

    // Log to database if authenticated or auth attempt (async, don't block request)
    if (req.user || req.path.startsWith('/api/auth')) {
      const vulnerabilityName = req.path.startsWith('/api/auth') ? 'Authentication Attempt' : extractVulnerabilityName(req.path);
      const riskScore = req.path.startsWith('/api/auth') ? 0 : calculateRiskScore(req);
      const flagged = req.path.startsWith('/api/auth') ? false : checkSuspiciousActivity(req);

      // Don't await, let it run in background
      Log.create({
        userId: req.user ? req.user._id : null,
        vulnerability: vulnerabilityName,
        requestData: {
          method: req.method,
          path: req.path,
          body: req.body,
          query: req.query,
          params: req.params,
        },
        ipAddress: ipAddress,
        endpoint: req.path,
        riskScore: riskScore,
        flagged: flagged,
        description: flagged ? 'Suspicious activity detected' : 'Request logged',
      }).catch((err) => {
        // Silently fail logging, don't break the request
        console.error('Logging error (non-blocking):', err.message);
      });
    }

    return res.send(data);
  };

  next();
};

// Helper function to check for suspicious activity
const checkSuspiciousActivity = (req) => {
  // Check for SQL injection patterns
  const sqlPatterns = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|EXECUTE)\b)/i;
  // Check for XSS patterns
  const xssPatterns = /<script|javascript:|onerror=|onload=/i;
  // Check for path traversal
  const pathTraversal = /\.\.\/|\.\.\\|%2e%2e%2f/i;

  const bodyString = JSON.stringify(req.body);
  const queryString = JSON.stringify(req.query);

  return (
    sqlPatterns.test(bodyString) ||
    sqlPatterns.test(queryString) ||
    xssPatterns.test(bodyString) ||
    xssPatterns.test(queryString) ||
    pathTraversal.test(bodyString) ||
    pathTraversal.test(queryString)
  );
};

// Extract vulnerability name from path
const extractVulnerabilityName = (path) => {
  if (path.includes('auth-weakness')) return 'Authentication Weakness';
  if (path.includes('input-validation')) return 'Input Validation';
  if (path.includes('access-control')) return 'Access Control';
  if (path.includes('session-handling')) return 'Session Handling';
  return 'Unknown Vulnerability';
};

// Calculate risk score based on request
const calculateRiskScore = (req) => {
  let score = 0;

  // Base score for lab endpoints
  if (req.path.startsWith('/api/labs')) {
    score += 20;
  }

  // Increase score for suspicious patterns
  if (checkSuspiciousActivity(req)) {
    score += 50;
  }

  // Increase score for admin endpoints accessed by non-admin
  if (req.path.includes('/admin') && req.user && req.user.role !== 'admin') {
    score += 30;
  }

  return Math.min(score, 100);
};

module.exports = loggerMiddleware;

