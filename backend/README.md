# AIIMS Hand Hygiene Portal - Backend API

A RESTful API powering the AIIMS Hand Hygiene Compliance System. Built with Node.js, Express, and MongoDB.

---

## Table of Contents

- [What This Is](#what-this-is)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Database Configuration](#database-configuration)
- [Running Locally](#running-locally)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Deployment](#deployment)
- [Common Issues](#common-issues)

---

## What This Is

This backend handles everything for the AIIMS Hand Hygiene Compliance System. You get user authentication with role-based access (Staff, Auditor, Admin), hand hygiene observation tracking, session management for auditors, a complete reward system with admin approval, leaderboards, analytics, and achievement badges. It also manages ward and department data.

---

## Tech Stack

**Core:**
- Node.js v18+ with Express.js 4.22
- MongoDB 8.21 with Mongoose ODM

**Security & Auth:**
- JWT tokens (jsonwebtoken 9.0)
- bcryptjs 2.4 for password hashing
- Helmet 7.2 for security headers
- express-rate-limit 7.5
- CORS 2.8

**Middleware & Validation:**
- express-validator 7.3
- cookie-parser 1.4
- morgan 1.10 for request logging

**File & Email:**
- Cloudinary 1.41 for image storage
- express-fileupload 1.5
- Nodemailer 6.10

**Dev Tools:**
- nodemon 3.0
- dotenv 16.6

---

## Features

Here's what's implemented:

**Authentication & Authorization**
- JWT-based auth with role-based access control
- Secure password hashing and token management
- Cookie handling and token refresh

**User Management**
- Registration, login, profile updates
- Role assignment (Staff/Auditor/Admin)
- Account activation/deactivation
- Password reset flow

**Observation System**
- Track hand hygiene observations with WHO 5 Moments
- Support for anonymous and identified observations
- Automatic points calculation
- Compliance tracking

**Session Management**
- Auditors can create and manage sessions
- Track active vs completed sessions
- Group observations by session
- Session summaries and stats

**Reward System**
- Full reward catalog management
- Point-based claiming
- Admin approval/rejection workflow
- Automatic refunds on rejection
- Unique reward codes

**Leaderboard & Rankings**
- Real-time leaderboards
- Rankings by points and compliance
- Department-wise filtering

**Reports & Analytics**
- Dashboard stats
- Compliance reports with trend analysis
- WHO moments breakdown
- Department distribution

**Badge System**
- Achievement tracking
- Point-based unlocking
- Bonus points on earning badges

---

## Getting Started

### What You'll Need

- Node.js v18.0.0 or higher
- npm v9.0.0+
- MongoDB v6.0+ (local install or Atlas account)
- Git

Check your versions:
```bash
node --version
npm --version
mongod --version
```

### Installation

Clone and install dependencies:

```bash
git clone <repository-url>
cd backend
npm install
```

---

## Environment Setup

Create a `.env` file in the backend directory. Here's what you need:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/aiims-hand-hygiene
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aiims-hand-hygiene

# JWT - use a strong random string (32+ characters)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=noreply@aiims.edu
FROM_NAME=AIIMS Hand Hygiene Portal

# Frontend
FRONTEND_URL=http://localhost:3000
```

**A few notes:**
- For `JWT_SECRET`, generate something strong and random. Don't use something weak.
- `SMTP_PASSWORD` should be a Gmail App Password, not your regular password.
- Never commit your `.env` file. It's in `.gitignore` for a reason.

---

## Database Configuration

### Option 1: Local MongoDB

Start MongoDB on your machine:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

Verify it's running:
```bash
mongosh
```

### Option 2: MongoDB Atlas (Cloud)

If you prefer cloud hosting:
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`

### Seeding the Database

You'll want some initial data to work with:

```bash
# Seed everything at once (recommended for first run)
npm run seed:all

# Or seed specific things:
npm run seed:admin      # Create admin user
npm run seed:badges     # Achievement badges
npm run seed:wards      # Hospital wards
npm run seed:departments
npm run seed:rewards
```

To create test users:
```bash
node seeds/seedTestUsers.js
```

This gives you 1 admin, 2 auditors, and 8 staff members with various point levels.

---

## Running Locally

Development mode (auto-restarts on file changes):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

You should see:
```
Server running in development mode on port 5000
✅ MongoDB Connected: localhost
```

Test it's working:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-29T..."
}
```

---

## API Reference

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Staff login | Public |
| POST | `/auth/admin-login` | Admin login | Public |
| POST | `/auth/auditor-login` | Auditor login | Public |
| POST | `/auth/forgot-password` | Password reset request | Public |
| PUT | `/auth/reset-password/:token` | Reset password | Public |

### Users

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | List all users | Admin |
| POST | `/users` | Create user | Admin |
| GET | `/users/:id` | Get user details | Private |
| PUT | `/users/:id` | Update user | Private |
| DELETE | `/users/:id` | Delete user | Admin |
| PUT | `/users/:id/role` | Change role | Admin |
| PUT | `/users/:id/toggle-status` | Activate/deactivate | Admin |
| GET | `/users/:id/stats` | User statistics | Private |
| GET | `/users/:id/activity` | User activity log | Private |
| GET | `/users/staff` | List staff users | Auditor/Admin |

### Observations

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/observations` | List observations | Private |
| POST | `/observations` | Record observation | Auditor/Admin |
| GET | `/observations/:id` | Get observation | Private |
| PUT | `/observations/:id` | Update observation | Auditor/Admin |
| DELETE | `/observations/:id` | Delete observation | Admin |
| GET | `/observations/user/:userId` | User's observations | Private |
| GET | `/observations/session/:sessionId` | Session observations | Private |

### Sessions

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/sessions` | List sessions | Private |
| POST | `/sessions` | Create session | Auditor/Admin |
| GET | `/sessions/:id` | Get session | Private |
| PUT | `/sessions/:id` | Update session | Auditor/Admin |
| DELETE | `/sessions/:id` | Delete session | Admin |
| PUT | `/sessions/:id/end` | End session | Auditor/Admin |

### Rewards

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/rewards` | List rewards | Private |
| POST | `/rewards` | Create reward | Admin |
| GET | `/rewards/:id` | Get reward | Private |
| PUT | `/rewards/:id` | Update reward | Admin |
| DELETE | `/rewards/:id` | Delete reward | Admin |
| POST | `/rewards/:id/claim` | Claim reward | Private |
| GET | `/rewards/user/:userId` | User's rewards | Private |
| GET | `/rewards/pending` | Pending approvals | Admin |
| PUT | `/rewards/user-reward/:id/approve` | Approve claim | Admin |
| PUT | `/rewards/user-reward/:id/reject` | Reject claim | Admin |

### Badges

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/badges` | List badges | Private |
| GET | `/badges/user/:userId` | User's badges | Private |
| POST | `/badges/check/:userId` | Check/award badges | Private |

### Wards

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/wards` | List wards | Private |
| POST | `/wards` | Create ward | Admin |
| GET | `/wards/:id` | Get ward | Private |
| PUT | `/wards/:id` | Update ward | Admin |
| DELETE | `/wards/:id` | Delete ward | Admin |

### Leaderboard

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/leaderboard` | Get leaderboard | Private |
| GET | `/leaderboard/user/:userId/rank` | User's rank | Private |

### Reports

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/reports/dashboard` | Dashboard stats | Private |
| GET | `/reports/compliance` | Compliance report | Private |
| GET | `/reports/trends` | Trend analysis | Private |
| GET | `/reports/detailed` | Detailed report | Private |

### Health Check

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/health` | Server status | Public |

---

## Project Structure

```
backend/
├── config/
│   ├── cloudinary.js       # Cloudinary setup
│   ├── db.js               # MongoDB connection
│   └── emailConfig.js      # Email templates
├── controllers/
│   ├── authController.js
│   ├── badgeController.js
│   ├── leaderboardController.js
│   ├── observationController.js
│   ├── reportController.js
│   ├── rewardController.js
│   ├── sessionController.js
│   ├── userController.js
│   └── wardController.js
├── middleware/
│   ├── asyncHandler.js     # Async error wrapper
│   ├── authMiddleware.js   # JWT verification
│   ├── errorHandler.js     # Error handling
│   ├── roleMiddleware.js   # Role checks
│   └── validationMiddleware.js
├── models/
│   ├── Badge.js
│   ├── Department.js
│   ├── Observation.js
│   ├── PointsHistory.js
│   ├── Reward.js
│   ├── Session.js
│   ├── User.js
│   ├── UserBadge.js
│   ├── UserReward.js
│   └── Ward.js
├── routes/
│   ├── authRoutes.js
│   ├── badgeRoutes.js
│   ├── leaderboardRoutes.js
│   ├── observationRoutes.js
│   ├── reportRoutes.js
│   ├── rewardRoutes.js
│   ├── sessionRoutes.js
│   ├── userRoutes.js
│   └── wardRoutes.js
├── scripts/
│   └── addUser.js          # CLI for adding users
├── seeds/
│   ├── seedAdmin.js
│   ├── seedAll.js
│   ├── seedBadges.js
│   ├── seedDepartments.js
│   ├── seedRewards.js
│   ├── seedTestUsers.js
│   └── seedWards.js
├── utils/
│   ├── generateToken.js    # JWT helpers
│   └── helpers.js
├── validators/
│   ├── authValidator.js
│   ├── observationValidator.js
│   ├── rewardValidator.js
│   └── userValidator.js
├── .env                    # Your secrets (not in git)
├── .gitignore
├── package.json
├── README.md
└── server.js              # App entry point
```

---

## Available Scripts

```bash
# Start server
npm start                 # Production mode
npm run dev              # Development (auto-restart)

# Database seeding
npm run seed:all         # Seed everything
npm run seed:admin       # Admin user only
npm run seed:badges      # Badges only
npm run seed:wards       # Wards only
npm run seed:departments # Departments only
npm run seed:rewards     # Rewards only

# Quick admin setup (new!)
npm run quick:setup      # Add/update admin & auditor (edit file first)
npm run manage:users     # Interactive user management

# Utilities
node scripts/addUser.js          # Add user via CLI
node seeds/seedTestUsers.js      # Create test accounts
```

### Quick Admin Setup (Easiest Way)

To quickly set up admin and auditor accounts:

1. Edit `backend/scripts/quickAddAdmin.js` (change email/password)
2. Run `npm run quick:setup`

Check `EASY_ADMIN_SETUP.md` for the full guide.

---

## Testing

### Manual Testing

Test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

Test login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aiims.edu","password":"Admin@123"}'
```

Test a protected endpoint (replace token):
```bash
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Credentials

After running `seedTestUsers.js`, you can use:

**Admin:**
- Email: `admin@aiims.edu`
- Password: `Admin@123`

**Auditor:**
- Email: `auditor@aiims.edu`
- Password: `Auditor@123`

**Staff:**
- Email: `sarah@aiims.edu`
- Password: `Staff@123`

---

## Deployment

### Recommended Platforms

- **Railway** - Easy deployment, has a free tier
- **Render** - Free tier available, auto-deploy from git
- **Heroku** - Well-known, straightforward setup
- **DigitalOcean** - More control if you need it

### Pre-Deployment Checklist

Before you deploy, make sure:

- [ ] `NODE_ENV` is set to `production`
- [ ] `JWT_SECRET` is strong and unique
- [ ] You're using a production MongoDB URI
- [ ] SSL/HTTPS is configured
- [ ] CORS points to your production frontend URL
- [ ] Rate limiting is enabled
- [ ] Error logging is set up
- [ ] You have a backup strategy

### Production Environment Variables

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=a_very_strong_production_secret_min_32_chars
FRONTEND_URL=https://your-frontend-domain.com
```

### Example: Deploying to Railway

```bash
# Log in to Railway
railway login

# Initialize project
railway init

# Deploy
railway up

# Set environment variables
railway variables set NODE_ENV=production
railway variables set MONGODB_URI="your_atlas_uri"
# Set the rest of your variables...

# Check it's working
curl https://your-app.railway.app/api/health
```

---

## Common Issues

### MongoDB Won't Connect

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

Check if MongoDB is running:
```bash
mongosh
```

Start it if it's not:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

Find what's using port 5000:
```bash
# Windows
netstat -ano | findstr :5000

# macOS/Linux
lsof -i :5000
```

Kill that process or change `PORT` in your `.env`.

### Missing JWT Secret

**Error:** `JWT_SECRET is not defined`

Make sure you have a `.env` file with `JWT_SECRET` set. Restart the server after adding it.

### Rate Limit Errors

**Error:** `429 Too Many Requests`

Wait a minute (or 15 minutes for auth endpoints). If you're testing locally, you can temporarily increase the limits in `server.js`.

### CORS Issues

**Error:** `Access-Control-Allow-Origin`

Update `FRONTEND_URL` in `.env` to match your frontend's URL. Restart the server and clear your browser cache.

---

## Additional Documentation

- **User Manual:** `../USER_MANUAL.md`
- **Deployment Guide:** `../DEPLOYMENT_GUIDE.md`
- **Integration Tests:** `../INTEGRATION_TEST_REPORT.md`

---

## License

ISC License - See LICENSE file for details.

---

## Version History

**v1.0.0** (2026-01-29)
- Initial release with complete API
- All CRUD operations implemented
- Authentication and role-based authorization
- Reward system with admin approval workflow
- Comprehensive reporting and analytics

---

**© 2026 All India Institute of Medical Sciences (AIIMS)**