# CyberShield Lab – Full Stack MERN Security Testing Platform

## 1. Project Overview

**CyberShield Lab** is a full‑stack web application built using **React (Vite)**, **Node.js**, **Express**, and **MongoDB**. The platform simulates a real cyber‑security service provider website while offering **authorized, controlled vulnerability testing labs** for learning and demonstration purposes.

> ⚠️ This project is strictly for **educational, academic, and authorized security testing** in a local or sandboxed environment.

---

## 2. Objectives

- Build a complete MERN stack application
- Implement secure authentication (JWT)
- Provide cyber‑security services UI
- Simulate common web vulnerabilities safely
- Log and analyze suspicious behavior
- Generate vulnerability reports
- Demonstrate both **attack surface** and **secure coding practices**

---

## 3. Tech Stack

### Frontend
- React 18 (Vite)
- React Router DOM
- Axios
- Tailwind CSS / Material UI

### Backend
- Node.js
- Express.js
- JSON Web Token (JWT)
- bcrypt
- Mongoose

### Database
- MongoDB (Local / Atlas)

### Development Tools
- Git & GitHub
- Postman
- MongoDB Compass
- VS Code

---

## 4. System Architecture

```
Client (React + Vite)
        |
        | REST API (JWT Auth)
        |
Server (Node.js + Express)
        |
        | Mongoose ODM
        |
     MongoDB
```

---

## 5. Features

### Core Features
- User Registration & Login
- JWT‑based Authentication
- Role‑based Access (User / Admin)
- Cyber Security Services Pages
- Vulnerability Testing Labs
- Request Logging & Monitoring
- Vulnerability Reports Dashboard

### Security Labs (Simulated)
- Authentication Weakness Lab
- Input Validation Lab
- Access Control Lab
- Session Handling Lab

---

## 6. Project Folder Structure

```
cybershield-lab/
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── api/
│       │   └── axios.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── ServiceCard.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── hooks/
│       │   └── useAuth.js
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Services.jsx
│       │   ├── Labs.jsx
│       │   ├── Reports.jsx
│       │   └── Admin.jsx
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── package.json
│   ├── .env
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       │   └── db.js
│       ├── models/
│       │   ├── User.js
│       │   ├── Vulnerability.js
│       │   └── Report.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── lab.controller.js
│       │   └── report.controller.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── lab.routes.js
│       │   └── report.routes.js
│       └── middleware/
│           ├── auth.middleware.js
│           └── logger.middleware.js
│
└── README.md
```

---

## 7. Database Schema Design

### User Collection
```js
{
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['user', 'admin'] },
  createdAt: Date
}
```

### Vulnerability Collection
```js
{
  name: String,
  category: String,
  enabled: Boolean,
  severity: String
}
```

### Report Collection
```js
{
  userId: ObjectId,
  vulnerability: String,
  requestData: Object,
  ipAddress: String,
  detectedAt: Date,
  riskScore: Number
}
```

---

## 8. Authentication Flow

1. User registers
2. Password hashed using bcrypt
3. JWT token issued
4. Token stored in browser storage
5. Protected routes verify JWT
6. Role‑based authorization enforced

---

## 9. Vulnerability Lab Workflow

1. Admin enables a vulnerability
2. Backend switches to weak logic (controlled)
3. User interacts with lab
4. Requests are monitored
5. Suspicious patterns logged
6. Report generated and shown in dashboard

---

## 10. Cyber Security Services Pages

- Web Application Security Testing
- Vulnerability Assessment
- Penetration Testing (Simulation)
- Security Audits
- Risk Analysis & Reporting

Each service links to a corresponding **lab demo**.

---

## 11. Logging & Monitoring

Every request includes:
- IP Address
- Endpoint
- Payload
- Timestamp
- Flagged Status

Used for reporting and visualization.

---

## 12. Environment Variables (.env)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/cybershield
JWT_SECRET=your_secret_key
```

---

## 13. Installation & Setup

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 14. Future Enhancements

- OWASP Top‑10 mapping
- Docker support
- CI/CD pipeline
- Role‑based dashboards
- PDF report export
- Integration with local security scanners

---

## 15. Conclusion

CyberShield Lab is a **production‑grade, academic‑ready MERN project** that demonstrates:
- Secure authentication
- Real‑world architecture
- Ethical vulnerability testing
- Cyber‑security fundamentals

This project is suitable for:
- Final year project
- Portfolio showcase
- Cyber‑security demonstrations
- Learning secure web development

---

**End of Documentation**

