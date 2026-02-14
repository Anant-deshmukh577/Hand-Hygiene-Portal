import express from 'express';
import {
  register,
  login,
  adminLogin,
  auditorLogin,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  googleAuth,
} from '../controllers/authController.js';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '../validators/authValidator.js';
import { validate } from '../middleware/validationMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/admin-login', loginValidator, validate, adminLogin);
router.post('/auditor-login', loginValidator, validate, auditorLogin);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPasswordValidator, validate, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidator, validate, resetPassword);
router.post('/google', googleAuth);

export default router;
