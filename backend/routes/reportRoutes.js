import express from 'express';
import {
  getDashboardStats,
  getComplianceReport,
  getDepartmentReport,
  getWardReport,
  getUserReport,
  getTrendReport,
  getWHOMomentsDistribution,
  exportReport,
} from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboardStats);
router.get('/compliance', protect, getComplianceReport);
router.get('/department/:department', protect, getDepartmentReport);
router.get('/ward/:ward', protect, getWardReport);
router.get('/user/:userId', protect, getUserReport);
router.get('/trends', protect, getTrendReport);
router.get('/who-moments', protect, getWHOMomentsDistribution);
router.get('/export/:format', protect, exportReport);

export default router;
