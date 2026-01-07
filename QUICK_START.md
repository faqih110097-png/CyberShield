# Quick Start Guide

## Prerequisites Check
- ✅ Node.js (v16+) installed
- ✅ MongoDB running locally OR MongoDB Atlas account

## Step-by-Step Setup

### 1. Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (see backend/ENV_SETUP.md)
# Copy the example and update with your values

# Seed initial vulnerabilities
npm run seed

# Start backend server
npm run dev
```

Backend should now be running on `http://localhost:5000`

### 2. Frontend Setup (3 minutes)

```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start frontend server
npm run dev
```

Frontend should now be running on `http://localhost:5173`

### 3. First Steps

1. **Open browser**: Navigate to `http://localhost:5173`
2. **Register**: Create a new account
3. **Create Admin** (optional): 
   - Register a user
   - In MongoDB, update the user's role to "admin":
     ```javascript
     db.users.updateOne(
       { email: "your-email@example.com" },
       { $set: { role: "admin" } }
     )
     ```
4. **Enable Labs**: Login as admin and go to Admin panel to enable labs
5. **Test Labs**: Navigate to Labs page and test vulnerabilities
6. **View Reports**: Check Reports page for your testing activities

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Check if port 5000 is available

### Frontend won't start
- Check if port 5173 is available (or use the port shown in terminal)
- Verify all dependencies are installed

### Can't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings if needed
- Verify API URL in frontend (default: http://localhost:5000/api)

### MongoDB connection error
- For local MongoDB: Ensure MongoDB service is running
- For Atlas: Check connection string and network access settings

## Next Steps

- Read the full README.md for detailed documentation
- Explore the Labs page to test vulnerabilities
- Check Reports page to see your activity
- Review Admin panel features (if admin)

## Support

Refer to:
- `README.md` - Full documentation
- `doc/implementation_plan.md` - Implementation details
- `doc/cyber_shield_lab_full_project_implementation_guide.md` - Project guide

