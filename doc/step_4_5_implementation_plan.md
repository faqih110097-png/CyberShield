# Implementation Plan for CyberShield Lab Steps 4-5: API Security and Session Management Vulnerabilities

## Overview
This implementation plan is based on the "CyberShield Lab – Detailed Implementation Guide (Steps 4–5)" document. It outlines a structured approach to implementing Steps 4 and 5 of the project, focusing on introducing controlled weaknesses in API Security & Data Exposure and Session & Token Management. The plan emphasizes educational value by demonstrating common vulnerabilities, identifying them, and preparing for later improvements.

The goal is to build on the foundation from Steps 1-3, expanding into backend and API-level security issues that represent critical real-world attack surfaces.

## Prerequisites
- **Software Requirements**:
  - Node.js (v16 or higher)
  - MongoDB (local or Atlas)
  - Git, VS Code, Postman, MongoDB Compass
- **Knowledge Requirements**:
  - JavaScript, React, Node.js, Express, MongoDB
  - Basic understanding of JWT, API security, and session management
- **Environment Setup**:
  - Backend `.env`: `PORT=5000`, `MONGO_URI=mongodb://localhost:27017/cybershield`, `JWT_SECRET=your_secret_key`
  - Ensure MongoDB is running
  - Steps 1-3 implementation completed

## Phase 1: Step 4 - API Security & Data Exposure Module (Estimated: 2-3 days)
**Objective**: Implement APIs with intentional weaknesses to demonstrate API Security Weakness & Excessive Data Exposure.

### What to Implement
- **Backend**:
  - User list API: `/api/users` returning all users with full data
  - Reports API: `/api/reports` accessible to all authenticated users
  - Labs API: `/api/labs` with shared access for user/admin roles
  - No role-based filtering in API responses
- **Frontend**:
  - Admin dashboard: Display user lists and reports
  - User dashboard: Access same APIs as admin
  - No frontend role checks for API calls

### Intentionally Weak Design Choices (Initial Implementation)
- APIs accessible after basic authentication only
- No role validation at API level
- Full database objects returned in responses
- Same API response for all user roles
- No data filtering based on user permissions

### Vulnerability Demonstrated
- API Security Weakness & Excessive Data Exposure: Exposes more data than required, no strict access control.

### How to Identify the Vulnerability
- Inspect API responses in Postman or browser dev tools
- Compare required vs returned fields
- Test API access as different user roles

### Strategy to Improve (Later Phase)
- Add authentication and authorization middleware
- Implement role-based API access control
- Filter API responses based on role
- Follow least-privilege principle

### Files to Edit/Create
- Backend: `backend/src/controllers/report.controller.js` (add user list endpoint), `backend/src/routes/report.routes.js` (add /users route), `backend/src/middleware/auth.middleware.js` (ensure no role enforcement).
- Frontend: `frontend/src/pages/Admin.jsx` (add user list display), `frontend/src/pages/Dashboard.jsx` (add reports access).

### Deliverables
- APIs returning full data without role-based restrictions.

## Phase 2: Step 5 - Session & Token Management Module (Estimated: 1-2 days)
**Objective**: Implement session management with intentional weaknesses to demonstrate Improper Session Management.

### What to Implement
- **Backend**:
  - JWT with long expiration time (already implemented)
  - No refresh token mechanism
  - Tokens remain valid after logout
  - No token invalidation on password change
- **Frontend**:
  - Store JWT in localStorage (already implemented)
  - Logout only clears frontend storage
  - No session expiration handling in UI
  - No automatic token refresh

### Intentionally Weak Design Choices (Initial Implementation)
- Long-lived access tokens (30 days)
- No token rotation
- No token invalidation
- Tokens stored in localStorage
- No server-side session termination

### Vulnerability Demonstrated
- Improper Session Management: Tokens remain valid for extended periods, no effective termination.

### How to Identify the Vulnerability
- Observe token expiry values
- Test behavior after logout (reuse old tokens)
- Monitor logs for token reuse

### Strategy to Improve (Later Phase)
- Reduce access token lifetime
- Implement refresh token mechanism
- Invalidate tokens on logout
- Store tokens in HttpOnly cookies
- Add server-side session management

### Files to Edit/Create
- Backend: `backend/src/controllers/auth.controller.js` (ensure long expiry, no invalidation), `backend/src/middleware/auth.middleware.js` (no token validation beyond expiry).
- Frontend: `frontend/src/context/AuthContext.jsx` (logout only clears localStorage), `frontend/src/hooks/useAuth.js` (no session checks).

### Deliverables
- Session management with long-lived tokens and weak termination.

## Phase 3: Integration and Initial Testing (Estimated: 1 day)
**Objective**: Connect components and test the weak implementations.

1. Run backend and frontend.
2. Test API endpoints for data exposure.
3. Test session management weaknesses.
4. Log and observe vulnerabilities.

**Deliverables**: Integrated system with identified API and session vulnerabilities.

## Phase 4: Vulnerability Analysis and Improvement Planning (Estimated: 1 day)
**Objective**: Document findings and plan fixes.

1. Analyze API responses and session behavior.
2. Prepare for later phases to strengthen security.

**Deliverables**: Report on vulnerabilities and improvement roadmap.

## Risk Management
- Ensure implementations are controlled and ethical.
- Avoid real exploits; use for education only.
- Build on existing Steps 1-3 without breaking functionality.

## Timeline Summary
- Total Estimated Time: 5-7 days.
- Focus on educational outcomes: Understanding API security risks and session management dangers.

This plan can be adjusted based on feedback. Proceed with implementation or modifications?
