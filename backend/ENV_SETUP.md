# Environment Variables Setup

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cybershield
JWT_SECRET=cybershield_secret_key_change_in_production_2024
```

## Instructions

1. Navigate to the `backend/` directory
2. Create a new file named `.env`
3. Copy the content above into the file
4. Modify `JWT_SECRET` to a secure random string for production use
5. Update `MONGO_URI` if using MongoDB Atlas or a different MongoDB instance

## MongoDB Atlas Setup (Optional)

If using MongoDB Atlas instead of local MongoDB:

1. Create a cluster on MongoDB Atlas
2. Get your connection string
3. Update `MONGO_URI` in `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cybershield
   ```

## Security Note

⚠️ **Never commit the `.env` file to version control!** It's already included in `.gitignore`.

