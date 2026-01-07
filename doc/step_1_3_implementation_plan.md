# Implementation Plan for CyberShield Lab Steps 1-3: Controlled Vulnerabilities

## Overview
This implementation plan is based on the "CyberShield Lab – Detailed Implementation Guide (Steps 1–3)" document. It outlines a structured approach to implementing the first three steps of the project, focusing on introducing controlled weaknesses in Authentication, Input Handling & Validation, and Access Control. The plan emphasizes educational value by demonstrating common vulnerabilities, identifying them, and preparing for later improvements.

The goal is to build a foundation for the CyberShield Lab platform, intentionally incorporating weak designs to simulate real-world security issues, while ensuring all implementations are for authorized, local testing only.

## Prerequisites
- **Software Requirements**:
  - Node.js (v16 or higher)
  - MongoDB (local or Atlas)
  - Git, VS Code, Postman, MongoDB Compass
- **Knowledge Requirements**:
  - JavaScript, React, Node.js, Express, MongoDB
  - Basic understanding of JWT, bcrypt, and security concepts
- **Environment Setup**:
  - Backend `.env`: `PORT=5000`, `MONGO_URI=mongodb://localhost:27017/cybershield`, `JWT_SECRET=your_secret_key`
  - Ensure MongoDB is running

## Phase 1: Step 1 - Authentication Module (Controlled Weak Authentication) (Estimated: 1-2 days)
**Objective**: Implement a basic authentication system with intentional weaknesses to demonstrate Broken Authentication.

### What to Implement
- **Backend**:
  - User registration API: Endpoint to create users with email and password.
  - User login API: Endpoint to authenticate users and return JWT.
  - Password hashing: Use bcrypt for storing passwords.
  - JWT generation: Create tokens for authenticated sessions.
  - JWT verification middleware: Basic middleware to check tokens.
- **Frontend**:
  - Register page: Form for email and password input.
  - Login page: Form for email and password, store JWT in localStorage.
  - Redirect to dashboard after login.

### Intentionally Weak Design Choices (Initial Implementation)
- No password complexity enforcement (e.g., allow any length).
- Unlimited login attempts (no rate limiting).
- No account lockout after failures.
- Long JWT expiration time (e.g., 24 hours).
- JWT stored in localStorage (not secure).

### Vulnerability Demonstrated
- Broken Authentication: Weak passwords, no limits on attempts, long-lived tokens.

### How to Identify the Vulnerability
- Monitor logs for repeated failed logins.
- Check password strength in database.
- Observe token usage and expiration.

### Strategy to Improve (Later Phase)
- Add password policies (length, complexity).
- Implement rate limiting and lockouts.
- Shorten JWT expiry and use HttpOnly cookies.

### Files to Edit/Create
- Backend: `backend/src/models/User.js` (add role field if needed), `backend/src/controllers/auth.controller.js`, `backend/src/routes/auth.routes.js`, `backend/src/middleware/auth.middleware.js`.
- Frontend: `frontend/src/pages/Register.jsx`, `frontend/src/pages/Login.jsx`, `frontend/src/context/AuthContext.jsx`.

### Deliverables
- Functional auth APIs and pages with weak designs.

## Phase 2: Step 2 - Input Handling & Validation Module (Estimated: 1-2 days)
**Objective**: Implement input forms with minimal validation to demonstrate Improper Input Validation.

### What to Implement
- **Backend**:
  - Feedback submission API: Store user feedback directly.
  - Contact message API: Store contact messages directly in MongoDB.
- **Frontend**:
  - Feedback form: Input fields for user feedback.
  - Contact form: Input fields for messages.
  - Display submitted feedback.

### Intentionally Weak Design Choices (Initial Implementation)
- No server-side validation.
- No input sanitization.
- Trust client-side input entirely.

### Vulnerability Demonstrated
- Improper Input Validation: Unchecked input can lead to injection or rendering issues.

### How to Identify the Vulnerability
- Review MongoDB data for unexpected content.
- Check logs for unusual payloads.

### Strategy to Improve (Later Phase)
- Add server-side validation and sanitization.
- Use schema validation in MongoDB.
- Escape content during rendering.

### Files to Edit/Create
- Backend: New models if needed (e.g., Feedback.js), `backend/src/controllers/lab.controller.js` or new controller, `backend/src/routes/lab.routes.js`.
- Frontend: `frontend/src/pages/Services.jsx` or new pages for forms, `frontend/src/components/ServiceCard.jsx`.

### Deliverables
- Input forms storing data without checks.

## Phase 3: Step 3 - Access Control Module (User vs Admin) (Estimated: 1-2 days)
**Objective**: Implement role-based access with minimal enforcement to demonstrate Broken Access Control.

### What to Implement
- **Backend**:
  - User model: Add role field (`user`, `admin`).
  - Admin-only endpoints: APIs restricted to admins.
  - Shared endpoints: Initially accessible to all.
- **Frontend**:
  - User dashboard: Basic view.
  - Admin dashboard: Conditional rendering.
  - Role-based navigation.

### Intentionally Weak Design Choices (Initial Implementation)
- Role checks only on frontend.
- Backend APIs do not enforce roles.
- Access based solely on ID without ownership checks.

### Vulnerability Demonstrated
- Broken Access Control: Users can access unauthorized resources.

### How to Identify the Vulnerability
- Analyze access logs for unauthorized calls.
- Test API access as non-admin user.

### Strategy to Improve (Later Phase)
- Enforce backend role checks.
- Add ownership validation.
- Use centralized middleware.

### Files to Edit/Create
- Backend: `backend/src/models/User.js` (update schema), `backend/src/controllers/report.controller.js` or lab.controller.js, `backend/src/routes/report.routes.js`, `backend/src/middleware/auth.middleware.js`.
- Frontend: `frontend/src/pages/Dashboard.jsx`, `frontend/src/pages/Admin.jsx`, `frontend/src/components/ProtectedRoute.jsx`.

### Deliverables
- Dashboards with weak access control.

## Phase 4: Integration and Initial Testing (Estimated: 1 day)
**Objective**: Connect components and test the weak implementations.

1. Run backend and frontend.
2. Test auth flow, input forms, and access controls.
3. Log and observe vulnerabilities.

**Deliverables**: Integrated system with identified weaknesses.

## Phase 5: Vulnerability Analysis and Improvement Planning (Estimated: 1 day)
**Objective**: Document findings and plan fixes.

1. Analyze logs and data for vulnerabilities.
2. Prepare for later phases to strengthen security.

**Deliverables**: Report on vulnerabilities and improvement roadmap.

## Risk Management
- Ensure implementations are controlled and ethical.
- Avoid real exploits; use for education only.

## Timeline Summary
- Total Estimated Time: 5-8 days.
- Focus on educational outcomes: Understanding auth failures, input risks, and access control dangers.

This plan can be adjusted based on feedback. Proceed with implementation or modifications?
