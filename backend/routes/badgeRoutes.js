import express from 'express';
import {
  getBadges,
  getUserBadges,
  checkAndAwardBadges,
} from '../controllers/badgeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getBadges);
router.get('/user/:userId', protect, getUserBadges);
router.post('/check/:userId', protect, checkAndAwardBadges);

export default router;