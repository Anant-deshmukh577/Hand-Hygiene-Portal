import express from 'express';
import {
  getObservations,
  getObservationById,
  createObservation,
  updateObservation,
  deleteObservation,
  getObservationsByUser,
  getObservationsBySession,
  bulkCreateObservations,
} from '../controllers/observationController.js';
import {
  createObservationValidator,
  observationIdValidator,
} from '../validators/observationValidator.js';
import { validate } from '../middleware/validationMiddleware.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getObservations);
router.get('/:id', protect, observationIdValidator, validate, getObservationById);
router.post('/', protect, authorize('auditor', 'admin'), createObservationValidator, validate, createObservation);
router.put('/:id', protect, authorize('auditor', 'admin'), observationIdValidator, validate, updateObservation);
router.delete('/:id', protect, authorize('admin'), observationIdValidator, validate, deleteObservation);
router.get('/user/:userId', protect, getObservationsByUser);
router.get('/session/:sessionId', protect, getObservationsBySession);
router.post('/bulk', protect, authorize('auditor', 'admin'), bulkCreateObservations);

export default router;