# Troubleshooting Login and Register Issues

## Common Issues and Solutions

### 1. Backend Server Not Running
**Symptoms**: Login/Register forms submit but nothing happens, or you see "Network Error"

**Solution**:
```bash
cd backend
npm run dev
```
Make sure the backend is running on `http://localhost:5000`

### 2. MongoDB Not Connected
**Symptoms**: Backend crashes or shows connection errors

**Solution**:
- **Local MongoDB**: Make sure MongoDB service is running
  ```bash
  # Windows: Check Services or run
  net start MongoDB
  ```
- **MongoDB Atlas**: Verify connection string in `.env` file
- Check `.env` file exists in `backend/` directory with:
  ```
  MONGO_URI=mongodb://localhost:27017/cybershield
  JWT_SECRET=your_secret_key
  ```

### 3. CORS Errors
**Symptoms**: Browser console shows CORS errors

**Solution**:
- Backend CORS is already configured, but verify:
  - Frontend is running on `http://localhost:5173` (or port shown)
  - Backend is running on `http://localhost:5000`
  - Check `vite.config.js` has proxy configuration

### 4. API URL Mismatch
**Symptoms**: Requests going to wrong URL

**Solution**:
- Check `frontend/src/api/axios.js` - default is `http://localhost:5000/api`
- Or create `frontend/.env` with:
  ```
  VITE_API_URL=http://localhost:5000/api
  ```

### 5. Password Field Not Working
**Symptoms**: Login fails even with correct password

**Solution**:
- The User model uses `select: false` for password
- Login controller uses `.select('+password')` to include it
- This should work, but if issues persist, check MongoDB connection

### 6. Form Validation Errors
**Symptoms**: Forms don't submit or show validation errors

**Solution**:
- Check browser console for JavaScript errors
- Verify all required fields are filled
- Password must be at least 6 characters
- Email must be valid format

## Debugging Steps

### 1. Check Backend Logs
```bash
cd backend
npm run dev
```
Look for:
- MongoDB connection messages
- Request logs
- Error messages

### 2. Check Frontend Console
Open browser DevTools (F12) and check:
- Console tab for errors
- Network tab for failed requests
- Application tab for localStorage

### 3. Test API Directly
Use Postman or curl to test:
```bash
# Test register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### 4. Verify Environment Variables
```bash
# Backend .env should have:
PORT=5000
MONGO_URI=mongodb://localhost:27017/cybershield
JWT_SECRET=your_secret_key_change_in_production
```

### 5. Clear Browser Storage
If you have old/invalid tokens:
1. Open DevTools (F12)
2. Go to Application tab
3. Clear Local Storage
4. Refresh page

## Quick Fix Checklist

- [ ] Backend server is running (`npm run dev` in backend/)
- [ ] MongoDB is running (local or Atlas)
- [ ] `.env` file exists in `backend/` directory
- [ ] Frontend server is running (`npm run dev` in frontend/)
- [ ] No CORS errors in browser console
- [ ] Network requests show in browser DevTools
- [ ] Backend logs show incoming requests
- [ ] MongoDB connection successful (check backend logs)

## Still Not Working?

1. **Check the browser console** for specific error messages
2. **Check the backend terminal** for error logs
3. **Verify both servers are running** on correct ports
4. **Test the API directly** with Postman to isolate frontend vs backend issues
5. **Check MongoDB** is accessible and database exists

## Getting Help

If issues persist:
1. Copy the exact error message from browser console
2. Copy backend terminal error logs
3. Check Network tab in DevTools for failed requests
4. Verify all prerequisites are installed (Node.js, MongoDB)

