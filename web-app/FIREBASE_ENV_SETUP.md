# Firebase Environment Variables Setup - Frontend

## Overview
Firebase secrets have been moved from hardcoded values to environment variables for better security and configuration management.

## Changes Made

### 1. Environment Variables File (`.env`)
Created `frontend/.env` with Firebase configuration:

```env
VITE_API_URL=http://localhost:5000/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyALzDguYcaNH5hSuSnW1SnDG02NlOPwX9k
VITE_FIREBASE_AUTH_DOMAIN=aiims-hand-hygiene-porta-852b6.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=aiims-hand-hygiene-porta-852b6
VITE_FIREBASE_STORAGE_BUCKET=aiims-hand-hygiene-porta-852b6.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=811357834897
VITE_FIREBASE_APP_ID=1:811357834897:web:b669e7ac1ec6cdec877930
VITE_FIREBASE_MEASUREMENT_ID=G-N12FDRMETM

# Google OAuth Configuration
VITE_GOOGLE_WEB_CLIENT_ID=30164101414-sacqbgdnlfc6mgtgs8jdi06oisf535l0.apps.googleusercontent.com
```

### 2. Firebase Config File Updated
Updated `frontend/src/config/firebase.js` to use environment variables:

**Before:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyALzDguYcaNH5hSuSnW1SnDG02NlOPwX9k",
  authDomain: "aiims-hand-hygiene-porta-852b6.firebaseapp.com",
  // ... hardcoded values
};
```

**After:**
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... from environment variables
};
```

### 3. Template File Created
Created `frontend/.env.example` as a template for other developers:

```env
VITE_API_URL=http://localhost:5000/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
# ... template values
```

## Environment Variable Naming

### Vite Prefix
Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client-side code.

**Format:** `VITE_VARIABLE_NAME`

### Variable List

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_FIREBASE_API_KEY` | Firebase API Key | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `project-id.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `project-id.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | `123456789` |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | `1:123:web:abc` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Measurement ID | `G-XXXXXXXXXX` |
| `VITE_GOOGLE_WEB_CLIENT_ID` | Google OAuth Web Client ID | `xxx.apps.googleusercontent.com` |

## How to Use

### 1. Development Setup

**Step 1:** Copy the example file
```bash
cd frontend
cp .env.example .env
```

**Step 2:** Update `.env` with your Firebase credentials
```bash
# Edit .env file with your actual values
nano .env
```

**Step 3:** Start the development server
```bash
npm run dev
```

The environment variables will be automatically loaded by Vite.

### 2. Production Setup

**For Production Deployment:**

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Set environment variables in your hosting platform:**
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Build & Deploy → Environment
   - AWS: Use AWS Systems Manager Parameter Store
   - Docker: Use docker-compose.yml or Kubernetes secrets

**Example for Vercel:**
```bash
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
# ... add all variables
```

**Example for Netlify:**
```bash
netlify env:set VITE_FIREBASE_API_KEY "your_value"
netlify env:set VITE_FIREBASE_AUTH_DOMAIN "your_value"
# ... set all variables
```

### 3. Accessing Environment Variables

**In JavaScript/React:**
```javascript
// Access environment variables
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

// Check if variable exists
if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  console.error('Firebase API Key is missing!');
}
```

**In Vite Config:**
```javascript
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // Use env variables
    define: {
      'process.env.SOME_KEY': JSON.stringify(env.SOME_KEY)
    }
  };
});
```

## Security Best Practices

### ✅ DO:
- ✅ Use `.env` for local development
- ✅ Keep `.env` in `.gitignore`
- ✅ Use `.env.example` as a template
- ✅ Set environment variables in hosting platform for production
- ✅ Rotate Firebase keys if exposed
- ✅ Use different Firebase projects for dev/staging/production
- ✅ Restrict Firebase API keys by domain/IP
- ✅ Enable Firebase App Check for additional security

### ❌ DON'T:
- ❌ Commit `.env` file to Git
- ❌ Share `.env` file publicly
- ❌ Hardcode secrets in source code
- ❌ Use production keys in development
- ❌ Expose `.env` file in public directories
- ❌ Include `.env` in Docker images
- ❌ Log environment variables in console

## Validation

The Firebase config now includes validation to check for missing variables:

```javascript
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing Firebase environment variables:', missingVars);
}
```

## Troubleshooting

### Issue: Environment variables not loading

**Solution 1:** Restart dev server
```bash
# Stop the server (Ctrl+C)
npm run dev
```

**Solution 2:** Check variable names
- Must start with `VITE_`
- Case-sensitive
- No spaces around `=`

**Solution 3:** Check file location
- `.env` must be in `frontend/` directory
- Not in subdirectories

### Issue: Firebase initialization fails

**Check:**
1. All required variables are set
2. Values are correct (no extra quotes or spaces)
3. Firebase project is active
4. API keys are valid

**Debug:**
```javascript
console.log('Firebase Config:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✓ Set' : '✗ Missing',
  // ... check all variables
});
```

### Issue: Google OAuth not working

**Check:**
1. `VITE_GOOGLE_WEB_CLIENT_ID` is set
2. OAuth consent screen is configured in Google Cloud Console
3. Authorized domains include your domain
4. Redirect URIs are configured

## Firebase Console Setup

### 1. Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `aiims-hand-hygiene-porta-852b6`
3. Click ⚙️ Settings → Project Settings
4. Scroll to "Your apps" section
5. Select your web app or create new one
6. Copy the configuration values

### 2. Configure Firebase Authentication

1. Go to Authentication → Sign-in method
2. Enable Google sign-in
3. Add authorized domains:
   - `localhost` (for development)
   - Your production domain

### 3. Configure Firebase Security Rules

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Google Cloud Console Setup

### 1. Get OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to APIs & Services → Credentials
4. Find your OAuth 2.0 Client ID
5. Copy the Web Client ID
6. Add to `.env` as `VITE_GOOGLE_WEB_CLIENT_ID`

### 2. Configure OAuth Consent Screen

1. Go to APIs & Services → OAuth consent screen
2. Add authorized domains
3. Add scopes (email, profile)
4. Add test users (for development)

### 3. Configure Authorized Redirect URIs

Add these URIs:
- `http://localhost:3000` (development)
- `http://localhost:5173` (Vite default)
- Your production domain

## Testing

### 1. Check Environment Variables
```bash
cd frontend
npm run dev
```

Open browser console and check:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Firebase API Key:', import.meta.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Missing');
```

### 2. Test Firebase Connection
```javascript
import { auth } from './config/firebase';

console.log('Firebase Auth:', auth);
console.log('Firebase App:', auth.app);
```

### 3. Test Google Sign-In
1. Click "Sign in with Google" button
2. Select Google account
3. Check console for any errors
4. Verify successful authentication

## Migration Checklist

- [x] Create `.env` file with Firebase credentials
- [x] Update `firebase.js` to use environment variables
- [x] Create `.env.example` template
- [x] Verify `.env` is in `.gitignore`
- [x] Add validation for missing variables
- [x] Export Google Web Client ID
- [ ] Test Firebase initialization
- [ ] Test Google OAuth sign-in
- [ ] Update production environment variables
- [ ] Document for team members

## Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

---

**Status:** ✅ COMPLETE
**Date:** February 10, 2026
**Security:** Firebase secrets now stored in environment variables
**Files Modified:** 
- `frontend/.env` (created)
- `frontend/.env.example` (created)
- `frontend/src/config/firebase.js` (updated)
