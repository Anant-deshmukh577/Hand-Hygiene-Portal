import express from 'express';
import {
  getUsers,
  createUser,
  getStaffUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadAvatar,
  updateAvatarUrl,
  deleteAvatar,
  changePassword,
  getUserStats,
  getUserActivity,
  updateUserRole,
  toggleUserStatus,
  getNotificationPreferences,
  updateNotificationPreferences,
} from '../controllers/userController.js';
import {
  updateUserValidator,
  userIdValidator,
  changePasswordValidator,
} from '../validators/userValidator.js';
import { validate } from '../middleware/validationMiddleware.js';
import { validateAvatarUpload } from '../middleware/fileUploadMiddleware.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Special routes (must come before /:id routes)
router.post('/change-password', protect, changePasswordValidator, validate, changePassword);
router.get('/staff', protect, authorize('auditor', 'admin'), getStaffUsers);
router.get('/notifications', protect, getNotificationPreferences);
router.put('/notifications', protect, updateNotificationPreferences);

// Standard CRUD routes
router.get('/', protect, authorize('admin'), getUsers);
router.post('/', protect, authorize('admin'), createUser);
router.get('/:id', protect, userIdValidator, validate, getUserById);
router.put('/:id', protect, userIdValidator, updateUserValidator, validate, updateUser);
router.delete('/:id', protect, authorize('admin'), userIdValidator, validate, deleteUser);

// AVATAR UPLOAD ROUTE
router.post('/:id/avatar', 
  protect, 
  userIdValidator, 
  validate, 
  validateAvatarUpload, 
  uploadAvatar
);

// AVATAR URL UPDATE ROUTE - FOR ANDROID DIRECT CLOUDINARY UPLOAD
router.patch('/:id/avatar-url', protect, userIdValidator, validate, updateAvatarUrl);

router.delete('/:id/avatar', protect, userIdValidator, validate, deleteAvatar);
router.get('/:id/stats', protect, userIdValidator, validate, getUserStats);
router.get('/:id/activity', protect, userIdValidator, validate, getUserActivity);
router.put('/:id/role', protect, authorize('admin'), userIdValidator, validate, updateUserRole);
router.put('/:id/toggle-status', protect, authorize('admin'), userIdValidator, validate, toggleUserStatus);

export default router;
