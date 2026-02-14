import express from 'express';
import {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  endSession,
  getActiveSessions,
} from '../controllers/sessionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getSessions);
router.get('/active', protect, getActiveSessions);
router.get('/:id', protect, getSessionById);
router.post('/', protect, authorize('auditor', 'admin'), createSession);
router.put('/:id', protect, authorize('auditor', 'admin'), updateSession);
router.delete('/:id', protect, authorize('admin'), deleteSession);
router.post('/:id/end', protect, authorize('auditor', 'admin'), endSession);

export default router;