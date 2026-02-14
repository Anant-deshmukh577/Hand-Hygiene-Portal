# Quick Start Guide - Frontend Setup

## Prerequisites
- Node.js 16+ installed
- npm or yarn installed
- Firebase project created
- Google OAuth configured

## Setup Steps

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

**Required Variables:**
```env
VITE_API_URL=http://localhost:5000/api

# Firebase (get from Firebase Console)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Google OAuth (get from Google Cloud Console)
VITE_GOOGLE_WEB_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

### 3. Start Backend Server
```bash
cd backend
npm start
```

Backend should run on `http://localhost:5000`

### 4. Start Frontend Development Server
```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173` (Vite default)

### 5. Open in Browser
```
http://localhost:5173
```

## Verify Setup

### Check Environment Variables
Open browser console:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Firebase configured:', !!import.meta.env.VITE_FIREBASE_API_KEY);
```

### Test Backend Connection
1. Open Network tab in DevTools
2. Navigate to any page
3. Check for API calls to `http://localhost:5000/api`
4. Verify responses are successful (200 status)

### Test Firebase Authentication
1. Click "Sign in with Google"
2. Select Google account
3. Check console for errors
4. Verify successful login

## Common Issues

### Issue: "Cannot find module"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Environment variables not loading
**Solution:**
```bash
# Restart dev server
# Press Ctrl+C to stop
npm run dev
```

### Issue: Firebase initialization error
**Solution:**
1. Check all Firebase variables are set in `.env`
2. Verify values are correct (no extra quotes)
3. Check Firebase project is active
4. Restart dev server

### Issue: CORS errors
**Solution:**
1. Check backend is running on port 5000
2. Verify `VITE_API_URL` matches backend URL
3. Check backend CORS configuration allows frontend origin

### Issue: Google OAuth not working
**Solution:**
1. Verify `VITE_GOOGLE_WEB_CLIENT_ID` is set
2. Check OAuth consent screen is configured
3. Add `localhost:5173` to authorized domains
4. Clear browser cache and cookies

## Build for Production

### 1. Build
```bash
npm run build
```

Output will be in `dist/` directory

### 2. Preview Production Build
```bash
npm run preview
```

### 3. Deploy
Upload `dist/` folder to your hosting platform:
- Vercel: `vercel deploy`
- Netlify: `netlify deploy`
- AWS S3: `aws s3 sync dist/ s3://your-bucket`

**Important:** Set environment variables in your hosting platform!

## Project Structure
```
frontend/
├── .env                    # Environment variables (DO NOT COMMIT)
├── .env.example           # Template for environment variables
├── src/
│   ├── config/
│   │   └── firebase.js    # Firebase configuration
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── utils/            # Utility functions
├── public/               # Static assets
└── package.json          # Dependencies
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## Environment-Specific Configuration

### Development
```env
VITE_API_URL=http://localhost:5000/api
```

### Production
```env
VITE_API_URL=https://your-api-domain.com/api
```

### Staging
```env
VITE_API_URL=https://staging-api-domain.com/api
```

## Next Steps

1. ✅ Setup complete
2. ✅ Environment variables configured
3. ✅ Backend connected
4. ✅ Firebase initialized
5. → Start developing!

## Need Help?

- Check `FIREBASE_ENV_SETUP.md` for detailed Firebase setup
- Check `WEB_OBSERVATION_FORM_UPDATE.md` for form documentation
- Check backend `README.md` for API documentation

---

**Happy Coding! 🚀**
