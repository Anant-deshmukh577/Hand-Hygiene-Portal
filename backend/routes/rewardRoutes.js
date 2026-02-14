import express from 'express';
import {
  getRewards,
  getRewardById,
  createReward,
  updateReward,
  deleteReward,
  claimReward,
  getUserRewards,
  getPointsHistory,
  approveUserReward,
  rejectUserReward,
  getPendingRewards,
} from '../controllers/rewardController.js';
import {
  createRewardValidator,
  rewardIdValidator,
} from '../validators/rewardValidator.js';
import { validate } from '../middleware/validationMiddleware.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getRewards);
router.get('/pending', protect, authorize('admin'), getPendingRewards);
router.get('/user/:userId', protect, getUserRewards);
router.get('/user/:userId/history', protect, getPointsHistory);
router.post('/', protect, authorize('admin'), createRewardValidator, validate, createReward);
router.put('/user-reward/:id/approve', protect, authorize('admin'), approveUserReward);
router.put('/user-reward/:id/reject', protect, authorize('admin'), rejectUserReward);
router.get('/:id', protect, rewardIdValidator, validate, getRewardById);
router.put('/:id', protect, authorize('admin'), rewardIdValidator, validate, updateReward);
router.delete('/:id', protect, authorize('admin'), rewardIdValidator, validate, deleteReward);
router.post('/:id/claim', protect, rewardIdValidator, validate, claimReward);

export default router;
