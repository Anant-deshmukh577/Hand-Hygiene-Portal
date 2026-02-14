import express from 'express';
import {
  getWards,
  getWardById,
  createWard,
  updateWard,
  deleteWard,
} from '../controllers/wardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getWards);
router.get('/:id', protect, getWardById);
router.post('/', protect, authorize('admin'), createWard);
router.put('/:id', protect, authorize('admin'), updateWard);
router.delete('/:id', protect, authorize('admin'), deleteWard);

export default router;