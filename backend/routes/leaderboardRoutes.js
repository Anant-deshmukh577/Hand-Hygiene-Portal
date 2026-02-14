import express from 'express';
import {
  getLeaderboard,
  getDepartmentRankings,
  getWardRankings,
  getUserRank,
  getTopPerformers,
} from '../controllers/leaderboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getLeaderboard);
router.get('/departments', protect, getDepartmentRankings);
router.get('/wards', protect, getWardRankings);
router.get('/user/:userId/rank', protect, getUserRank);
router.get('/top', protect, getTopPerformers);

export default router;