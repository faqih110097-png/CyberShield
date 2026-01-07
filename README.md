# CyberShield Lab - Full Stack MERN Security Testing Platform

A comprehensive, production-grade MERN stack application for educational cybersecurity testing. This platform simulates real cyber-security service provider functionality while offering authorized, controlled vulnerability testing labs for learning and demonstration purposes.

> ⚠️ **Important**: This project is strictly for **educational, academic, and authorized security testing** in a local or sandboxed environment.

## 🎯 Features

### Core Features
- ✅ User Registration & Login with JWT Authentication
- ✅ Role-based Access Control (User / Admin)
- ✅ Cyber Security Services Pages
- ✅ Vulnerability Testing Labs (4 different labs)
- ✅ Request Logging & Monitoring
- ✅ Vulnerability Reports Dashboard
- ✅ Admin Panel for Lab Management

### Security Labs (Simulated)
1. **Authentication Weakness Lab** - Demonstrates weak authentication mechanisms
2. **Input Validation Lab** - Shows insufficient input validation issues
3. **Access Control Lab** - Illustrates improper access control
4. **Session Handling Lab** - Demonstrates weak session management

## 🛠️ Tech Stack

### Frontend
- React 19 (Vite)
- React Router DOM
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- JSON Web Token (JWT)
- bcryptjs
- Mongoose

### Database
- MongoDB (Local / Atlas)

## 📁 Project Structure

```
Cyber_Corpo/
├── frontend/
│   ├── src/
│   │   ├── api/          # API configuration
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React context (Auth)
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Page components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/       # Database & config
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Auth & logging middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
└── doc/                  # Documentation
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cybershield
JWT_SECRET=your_secret_key_change_in_production
```

4. Seed initial vulnerabilities:
```bash
npm run seed
```

5. Start the backend server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Labs
- `GET /api/labs` - Get all vulnerabilities (Protected)
- `GET /api/labs/:id` - Get single vulnerability (Protected)
- `PUT /api/labs/:id/toggle` - Enable/Disable vulnerability (Admin only)
- `POST /api/labs/auth-weakness` - Test authentication weakness (Protected)
- `POST /api/labs/input-validation` - Test input validation (Protected)
- `GET /api/labs/access-control` - Test access control (Protected)
- `POST /api/labs/session-handling` - Test session handling (Protected)

### Reports
- `GET /api/reports` - Get user's reports (Protected)
- `GET /api/reports/stats` - Get report statistics (Protected)
- `GET /api/reports/all` - Get all reports (Admin only)
- `GET /api/reports/:id` - Get single report (Protected)
- `DELETE /api/reports/:id` - Delete report (Protected)

## 🔐 Default Admin Account

To create an admin account, register a new user and then manually update the role in MongoDB:

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

Or register with role in the registration request (if you modify the backend to allow it during registration).

## 🎓 Usage Guide

1. **Register/Login**: Create an account or login with existing credentials
2. **Explore Services**: Browse the cyber security services offered
3. **Test Labs**: 
   - Admin must enable labs first (via Admin panel)
   - Navigate to Labs page
   - Run tests on enabled vulnerabilities
   - View results and learn about security issues
4. **View Reports**: Check your security testing reports and statistics
5. **Admin Panel**: (Admin only) Enable/disable labs and view all reports

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Request logging and monitoring
- Input validation
- Protected API routes
- Secure session handling

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/cybershield
JWT_SECRET=your_secret_key_change_in_production
```

### Frontend (optional)
Create `.env` file in frontend directory:
```
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Manual Testing
1. Start both backend and frontend servers
2. Register a new user
3. Login and explore the dashboard
4. Test labs (after admin enables them)
5. View reports

### API Testing
Use Postman or similar tool to test API endpoints:
- Import the API endpoints listed above
- Use JWT token from login response in Authorization header: `Bearer <token>`

## 📦 Build for Production

### Frontend
```bash
cd frontend
npm run build
```
The build output will be in `frontend/dist/`

### Backend
```bash
cd backend
npm start
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or update `MONGO_URI` in `.env` for Atlas
- Check connection string format

### CORS Issues
- Backend CORS is configured to allow all origins in development
- Update CORS settings in `backend/src/app.js` for production

### Authentication Issues
- Check JWT_SECRET in backend `.env`
- Verify token is being sent in Authorization header
- Check token expiration (default: 30 days)

## 📄 License

This project is for educational purposes only.

## 🤝 Contributing

This is an academic project. Contributions and suggestions are welcome!

## 📧 Support

For issues or questions, please refer to the documentation in the `doc/` directory.

## 🎯 Future Enhancements

- [ ] PDF report export
- [ ] Docker support
- [ ] CI/CD pipeline
- [ ] Additional vulnerability labs
- [ ] OWASP Top-10 mapping
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard

---

**Built with ❤️ for cybersecurity education**
