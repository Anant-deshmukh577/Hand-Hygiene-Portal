import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { initializeEmailService } from './config/emailConfig.js';
import errorHandler from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import observationRoutes from './routes/observationRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import rewardRoutes from './routes/rewardRoutes.js';
import badgeRoutes from './routes/badgeRoutes.js';
import wardRoutes from './routes/wardRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize email service
initializeEmailService();

const app = express();

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create temp directory for file uploads (must exist for express-fileupload)
const tempDir = path.join(__dirname, 'tmp');
try {
  fs.mkdirSync(tempDir, { recursive: true });
} catch (err) {
  console.warn('Could not create upload temp dir:', err.message);
}

// Body parser - INCREASED LIMITS FOR FILE UPLOADS
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Cookie parser
app.use(cookieParser());

// File upload - with improved config for Windows
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: tempDir,
  createParentPath: true,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max file size
  abortOnLimit: true,
  responseOnLimit: 'File size exceeds the limit of 50 MB',
  useSingleFile: false,
}));

// CORS - Allow multiple origins for web and mobile
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:19006', // Expo web
  'http://10.0.2.2:19006', // Android emulator
  'http://10.3.1.30:8081', // Android physical device (Expo)
  'http://192.168.1.1:8081', // Common local network range
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow any origin that starts with http://10. or http://192.168. (local network)
    if (origin.startsWith('http://10.') || origin.startsWith('http://192.168.')) {
      return callback(null, true);
    }
    
    // Check against allowed origins list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow in development
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Security headers
app.use(helmet());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting - More lenient for dashboard usage
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 100, // Allow 100 requests per minute for normal usage
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again in a minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for health check endpoint
  skip: (req) => req.path === '/api/health',
});

// Stricter rate limiting for authentication endpoints to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 10, // Only 10 login attempts per 15 minutes
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limiting to all API routes
app.use('/api', generalLimiter);

// Apply stricter rate limiting to specific auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/admin-login', authLimiter);
app.use('/api/auth/auditor-login', authLimiter);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/observations', observationRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/wards', wardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/departments', departmentRoutes);

// Error handler (must be after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Accessible at: http://localhost:${PORT} and http://0.0.0.0:${PORT}`);
  console.log(`For Android devices, use: http://YOUR_LOCAL_IP:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

export default app;