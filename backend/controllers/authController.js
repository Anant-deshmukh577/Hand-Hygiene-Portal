import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import { sendTokenResponse, generateToken } from '../utils/generateToken.js';
import { sendEmail, sendWelcomeEmail, sendPasswordResetEmail, sendPasswordChangedEmail } from '../config/emailConfig.js';
import crypto from 'crypto';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, department, designation } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email',
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    department,
    designation,
  });

  // Send welcome email (don't await to not block the response)
  sendWelcomeEmail(user).catch(err => {
    console.error('Failed to send welcome email:', err.message);
  });

  // Send token response
  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Check if user is admin - admin must use admin-login endpoint
  if (user.role === 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin accounts must use the admin login page. Please navigate to /admin-login',
    });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Your account has been deactivated. Please contact admin.',
    });
  }

  // Send token response
  sendTokenResponse(user, 200, res);
});

// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({
      success: false,
      message: 'ID token is required',
    });
  }

  try {
    // Decode the Firebase ID token (JWT) to get user info
    // The token is base64 encoded with 3 parts: header.payload.signature
    const tokenParts = idToken.split('.');
    if (tokenParts.length !== 3) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format',
      });
    }

    // Decode the payload (second part)
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf8'));
    
    console.log('Decoded Firebase token payload:', payload);

    // Extract user info from Firebase token
    const { email, name, picture, email_verified, firebase } = payload;

    // Verify this is a Firebase token and check expiration
    if (!firebase || !payload.iss?.includes('securetoken.google.com')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Firebase token',
      });
    }

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
      });
    }

    if (!email) {
      return res.status(401).json({
        success: false,
        message: 'Email not provided in token',
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Your account has been deactivated. Please contact admin.',
        });
      }

      // Update Google-specific fields if needed
      if (!user.googleId) {
        user.googleId = payload.sub || payload.user_id;
        user.avatar = user.avatar || picture;
        await user.save();
      }
    } else {
      // Create new user with Google info
      user = await User.create({
        name: name || email.split('@')[0],
        email: email,
        googleId: payload.sub || payload.user_id,
        avatar: picture || '',
        isEmailVerified: email_verified !== false,
        // Generate a random password for Google users (they won't use it)
        password: crypto.randomBytes(32).toString('hex'),
      });

      // Send welcome email for new Google users (don't await to not block)
      sendWelcomeEmail(user).catch(err => {
        console.error('Failed to send welcome email:', err.message);
      });
    }

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(500).json({
      success: false,
      message: 'Google authentication failed: ' + error.message,
    });
  }
});

// @desc    Login admin
// @route   POST /api/auth/admin-login
// @access  Public
export const adminLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Check if user is admin
  if (user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'You do not have admin access. Please use regular login.',
    });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Your account has been deactivated. Please contact admin.',
    });
  }

  // Send token response
  sendTokenResponse(user, 200, res);
});

// @desc    Login auditor
// @route   POST /api/auth/auditor-login
// @access  Public
export const auditorLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Check if user is auditor
  if (user.role !== 'auditor') {
    return res.status(403).json({
      success: false,
      message: 'You do not have auditor access. Please use regular login.',
    });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Your account has been deactivated. Please contact admin.',
    });
  }

  // Send token response
  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
      phone: user.phone,
      avatar: user.avatar,
      totalPoints: user.totalPoints,
      totalObservations: user.totalObservations,
      complianceRate: user.complianceRate,
      isActive: user.isActive,
      googleId: user.googleId, // Include to detect OAuth users
      facebookId: user.facebookId, // Include to detect OAuth users
    },
  });
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found with this email',
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    await sendPasswordResetEmail(user, resetUrl);

    res.status(200).json({
      success: true,
      message: 'Email sent with reset instructions',
    });
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      success: false,
      message: 'Email could not be sent',
    });
  }
});

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  // Send password changed confirmation email (don't await to not block)
  sendPasswordChangedEmail(user).catch(err => {
    console.error('Failed to send password changed email:', err.message);
  });

  sendTokenResponse(user, 200, res);
});
