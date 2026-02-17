import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import Observation from '../models/Observation.js';
import PointsHistory from '../models/PointsHistory.js';
import cloudinary, { cloudinaryStatus } from '../config/cloudinary.js';
import fs from 'fs';

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, role, department, search } = req.query;

  const query = {};

  if (role) query.role = role;
  if (department) query.department = department;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('-password')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
    users,
  });
});

// @desc    Create new user (Admin)
// @route   POST /api/users
// @access  Private/Admin
export const createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, department, designation, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists',
    });
  }

  // Validate role
  if (!['staff', 'auditor', 'admin'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role. Must be staff, auditor, or admin',
    });
  }

  // Create user
  const user = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    phone: phone.trim(),
    department: department.trim(),
    designation: designation.trim(),
    role,
    isActive: true,
    isEmailVerified: true,
    totalPoints: 0,
    totalObservations: 0,
    complianceRate: 0,
  });

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(201).json({
    success: true,
    message: `${role.charAt(0).toUpperCase() + role.slice(1)} user created successfully`,
    user: userResponse,
  });
});

// @desc    Get staff users (Auditor/Admin)
// @route   GET /api/users/staff
// @access  Private/Auditor
export const getStaffUsers = asyncHandler(async (req, res, next) => {
  const { search, department, designation, limit = 100 } = req.query;
  const query = { role: 'staff', isActive: true };

  if (department) query.department = department;
  if (designation) query.designation = designation;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(query)
    .select('name email department designation')
    .limit(parseInt(limit))
    .sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = asyncHandler(async (req, res, next) => {
  const { name, phone, department, designation } = req.body;

  // Make sure user is updating their own profile or is admin
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this profile',
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Update fields
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (department) user.department = department;
  if (designation) user.designation = designation;

  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Prevent admin from deleting themselves
  if (user.id === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete your own account',
    });
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

// @desc    Upload user avatar
// @route   POST /api/users/:id/avatar
// @access  Private
export const uploadAvatar = asyncHandler(async (req, res, next) => {
  console.log('[uploadAvatar] ========== UPLOAD REQUEST RECEIVED ==========');
  console.log('[uploadAvatar] User ID from params:', req.params.id);
  console.log('[uploadAvatar] Authenticated user ID:', req.user.id);
  console.log('[uploadAvatar] Has req.files:', !!req.files);
  console.log('[uploadAvatar] Files keys:', req.files ? Object.keys(req.files) : 'none');
  
  // Make sure user is updating their own avatar or is admin
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    console.error('[uploadAvatar] Authorization failed');
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this avatar',
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    console.error('[uploadAvatar] User not found');
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  if (!cloudinaryStatus.isConfigured) {
    console.error('[uploadAvatar] Cloudinary not configured');
    return res.status(500).json({
      success: false,
      message: `Cloudinary is not configured. Add these to backend/.env: ${cloudinaryStatus.missing.join(', ')}`,
    });
  }

  // File validation is now handled by validateAvatarUpload middleware
  const file = req.files.avatar;
  let tempFilePath = file.tempFilePath;

  console.log('[uploadAvatar] File details:', {
    name: file.name,
    size: file.size,
    mimetype: file.mimetype,
    tempFilePath: tempFilePath,
    hasTempFile: tempFilePath && fs.existsSync(tempFilePath),
    hasBuffer: file.data && Buffer.isBuffer(file.data),
  });

  try {
    console.log('[uploadAvatar] Starting Cloudinary upload...');

    const uploadOptions = {
      folder: 'aiims-avatars',
      width: 200,
      crop: 'scale',
      resource_type: 'auto',
      timeout: 60000,
    };

    // Prefer temp file; fallback to buffer (base64) if temp file missing
    let result;
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      console.log('[uploadAvatar] Uploading from temp file');
      result = await cloudinary.uploader.upload(tempFilePath, uploadOptions);
    } else if (file.data && Buffer.isBuffer(file.data)) {
      console.log('[uploadAvatar] Uploading from buffer (base64)');
      result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.data.toString('base64')}`,
        uploadOptions
      );
    } else {
      console.error('[uploadAvatar] No file data available');
      return res.status(500).json({
        success: false,
        message: 'File data not available for upload. Please try again.',
      });
    }

    console.log('[uploadAvatar] Cloudinary upload successful:', result.secure_url);

    // Delete old avatar from cloudinary if exists
    if (user.avatar) {
      try {
        const publicId = user.avatar.split('/').pop().split('.')[0];
        console.log('[uploadAvatar] Deleting old avatar with publicId:', publicId);
        await cloudinary.uploader.destroy(`aiims-avatars/${publicId}`);
        console.log('[uploadAvatar] Old avatar deleted successfully');
      } catch (err) {
        // Log error but don't fail the request if old avatar deletion fails
        console.error('[uploadAvatar] Error deleting old avatar:', err.message);
      }
    }

    user.avatar = result.secure_url;
    await user.save();

    console.log('[uploadAvatar] User avatar saved to database');
    console.log('[uploadAvatar] ========== UPLOAD SUCCESS ==========');

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
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
      },
    });
  } catch (error) {
    console.error('[uploadAvatar] ========== UPLOAD ERROR ==========');
    console.error('[uploadAvatar] Error type:', error.constructor.name);
    console.error('[uploadAvatar] Error message:', error.message);
    console.error('[uploadAvatar] Error code:', error.statusCode || error.code);
    console.error('[uploadAvatar] Error stack:', error.stack);

    // User-friendly message for Cloudinary config/auth errors
    let userMessage = 'Failed to upload avatar to cloud storage.';
    const msg = (error.message || '').toLowerCase();
    if (msg.includes('invalid') && (msg.includes('key') || msg.includes('credential') || msg.includes('api'))) {
      userMessage = 'Cloudinary credentials are invalid. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env';
    } else if (msg.includes('cloud_name') || msg.includes('must supply')) {
      userMessage = 'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to backend/.env';
    } else if (error.message) {
      userMessage = error.message;
    }

    return res.status(500).json({
      success: false,
      message: userMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  } finally {
    // Clean up temp file
    try {
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
        console.log('[uploadAvatar] Temp file cleaned up:', tempFilePath);
      }
    } catch (err) {
      console.error('[uploadAvatar] Error cleaning up temp file:', err.message);
    }
  }
});

// @desc    Delete user avatar
// @route   DELETE /api/users/:id/avatar
// @access  Private
export const deleteAvatar = asyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this avatar',
    });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  if (!user.avatar) {
    return res.status(400).json({
      success: false,
      message: 'User has no avatar to delete',
    });
  }

  try {
    const publicId = user.avatar.split('/').pop().split('.')[0];
    if (cloudinaryStatus.isConfigured) {
      await cloudinary.uploader.destroy(`aiims-avatars/${publicId}`);
    }
  } catch (err) {
    console.error('Error deleting avatar from Cloudinary:', err.message);
  }

  user.avatar = '';
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Avatar deleted successfully',
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
    },
  });
});

// @desc    Update user avatar URL (Android direct Cloudinary upload)
// @route   PATCH /api/users/:id/avatar-url
// @access  Private
export const updateAvatarUrl = asyncHandler(async (req, res, next) => {
  console.log('[updateAvatarUrl] ========== UPDATE AVATAR URL ==========');
  console.log('[updateAvatarUrl] User ID:', req.params.id);
  console.log('[updateAvatarUrl] Request body:', req.body);
  
  const { avatar } = req.body;

  if (!avatar) {
    console.error('[updateAvatarUrl] No avatar URL provided');
    return res.status(400).json({
      success: false,
      message: 'Avatar URL is required',
    });
  }

  // Validate URL format
  if (!avatar.startsWith('http://') && !avatar.startsWith('https://')) {
    console.error('[updateAvatarUrl] Invalid URL format:', avatar);
    return res.status(400).json({
      success: false,
      message: 'Invalid avatar URL format',
    });
  }

  // Make sure user is updating their own avatar or is admin
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    console.error('[updateAvatarUrl] Authorization failed');
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this avatar',
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    console.error('[updateAvatarUrl] User not found');
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Delete old avatar from Cloudinary if exists and is a Cloudinary URL
  if (user.avatar && user.avatar.includes('cloudinary.com')) {
    try {
      const urlParts = user.avatar.split('/');
      const publicIdWithExt = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExt.split('.')[0];
      const folder = urlParts[urlParts.length - 2];
      
      console.log('[updateAvatarUrl] Deleting old avatar:', `${folder}/${publicId}`);
      
      if (cloudinaryStatus.isConfigured) {
        await cloudinary.uploader.destroy(`${folder}/${publicId}`);
        console.log('[updateAvatarUrl] Old avatar deleted successfully');
      }
    } catch (err) {
      console.error('[updateAvatarUrl] Error deleting old avatar:', err.message);
      // Don't fail the request if old avatar deletion fails
    }
  }

  user.avatar = avatar;
  await user.save();

  console.log('[updateAvatarUrl] Avatar URL updated successfully');
  console.log('[updateAvatarUrl] ========== UPDATE SUCCESS ==========');

  res.status(200).json({
    success: true,
    message: 'Avatar updated successfully',
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
    },
  });
});

// @desc    Change password
// @route   POST /api/users/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // Check if user is OAuth user (Google/Facebook)
  const isOAuthUser = user.googleId || user.facebookId;

  if (isOAuthUser) {
    // OAuth users don't have a password they know
    // Allow them to set a new password directly
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password set successfully. You can now use this password to login.',
    });
  }

  // For regular users, verify current password
  if (!currentPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password is required',
    });
  }

  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

// @desc    Get user stats
// @route   GET /api/users/:id/stats
// @access  Private
export const getUserStats = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Get observations
  const observations = await Observation.find({ observedStaff: user.id });

  // Calculate stats from actual observation records (source of truth)
  const totalObservations = observations.length;
  const adherenceCount = observations.filter(o => o.adherence === 'adherence').length;
  const partialCount = observations.filter(o => o.adherence === 'partial').length;
  const missedCount = observations.filter(o => o.adherence === 'missed').length;

  const complianceRate = totalObservations > 0
    ? parseFloat(((adherenceCount / totalObservations) * 100).toFixed(1))
    : 0;

  // Calculate totalPoints from PointsHistory (includes both earned and spent points)
  // This is the TRUE source of truth as it includes observations, rewards, badges, etc.
  const pointsHistory = await PointsHistory.find({ user: user.id });
  const calculatedTotalPoints = pointsHistory.reduce((sum, ph) => sum + ph.points, 0);

  // Sync user record if it drifted from actual data
  if (user.totalPoints !== calculatedTotalPoints ||
      user.totalObservations !== totalObservations ||
      user.complianceRate !== complianceRate) {
    user.totalPoints = calculatedTotalPoints;
    user.totalObservations = totalObservations;
    user.complianceRate = complianceRate;
    await user.save();
  }

  const stats = {
    totalPoints: calculatedTotalPoints,
    totalObservations,
    complianceRate,
    breakdown: {
      adherence: adherenceCount,
      partial: partialCount,
      missed: missedCount,
    },
  };

  res.status(200).json({
    success: true,
    stats,
  });
});

// @desc    Get user activity
// @route   GET /api/users/:id/activity
// @access  Private
export const getUserActivity = asyncHandler(async (req, res, next) => {
  const activities = await PointsHistory.find({ user: req.params.id })
    .sort({ createdAt: -1 })
    .limit(20);

  res.status(200).json({
    success: true,
    count: activities.length,
    activities,
  });
});

// @desc    Update user role (Admin)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  if (!['staff', 'auditor', 'admin'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role',
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    user,
  });
});

// @desc    Toggle user active status (Admin)
// @route   PUT /api/users/:id/toggle-status
// @access  Private/Admin
export const toggleUserStatus = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Prevent admin from deactivating themselves
  if (user.id === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'Cannot deactivate your own account',
    });
  }

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    user,
  });
});

// @desc    Get notification preferences
// @route   GET /api/users/notifications
// @access  Private
export const getNotificationPreferences = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('notificationPreferences');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    notificationPreferences: user.notificationPreferences || {
      emailNotifications: true,
      badgeAlerts: true,
      leaderboardUpdates: false,
      weeklyReports: true,
    },
  });
});

// @desc    Update notification preferences
// @route   PUT /api/users/notifications
// @access  Private
export const updateNotificationPreferences = asyncHandler(async (req, res, next) => {
  const { emailNotifications, badgeAlerts, leaderboardUpdates, weeklyReports } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Validate boolean values
  const updates = {};
  if (typeof emailNotifications === 'boolean') updates.emailNotifications = emailNotifications;
  if (typeof badgeAlerts === 'boolean') updates.badgeAlerts = badgeAlerts;
  if (typeof leaderboardUpdates === 'boolean') updates.leaderboardUpdates = leaderboardUpdates;
  if (typeof weeklyReports === 'boolean') updates.weeklyReports = weeklyReports;

  // Update notification preferences
  user.notificationPreferences = {
    ...user.notificationPreferences,
    ...updates,
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Notification preferences updated successfully',
    notificationPreferences: user.notificationPreferences,
  });
});
