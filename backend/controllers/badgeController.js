import asyncHandler from '../middleware/asyncHandler.js';
import Badge from '../models/Badge.js';
import UserBadge from '../models/UserBadge.js';
import User from '../models/User.js';
import PointsHistory from '../models/PointsHistory.js';

// @desc    Get all badges
// @route   GET /api/badges
// @access  Private
export const getBadges = asyncHandler(async (req, res, next) => {
  const badges = await Badge.find().sort({ pointsRequired: 1 });

  res.status(200).json({
    success: true,
    count: badges.length,
    badges,
  });
});

// @desc    Get user badges
// @route   GET /api/badges/user/:userId
// @access  Private
export const getUserBadges = asyncHandler(async (req, res, next) => {
  const userBadges = await UserBadge.find({ user: req.params.userId })
    .populate('badge')
    .sort({ earnedAt: -1 });

  res.status(200).json({
    success: true,
    count: userBadges.length,
    badges: userBadges,
  });
});

// @desc    Check and award badges
// @route   POST /api/badges/check/:userId
// @access  Private
export const checkAndAwardBadges = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const badges = await Badge.find().sort({ pointsRequired: 1 });
  const userBadges = await UserBadge.find({ user: user._id });
  const earnedBadgeIds = userBadges.map(ub => ub.badge.toString());

  const newBadges = [];

  for (const badge of badges) {
    // Check if user has enough points and hasn't earned this badge
    if (user.totalPoints >= badge.pointsRequired && !earnedBadgeIds.includes(badge._id.toString())) {
      const userBadge = await UserBadge.create({
        user: user._id,
        badge: badge._id,
        pointsAtEarning: user.totalPoints,
      });

      // Award bonus points for badge
      const bonusPoints = badge.pointsRequired * 0.1; // 10% bonus
      user.totalPoints += bonusPoints;

      // Create points history
      await PointsHistory.create({
        user: user._id,
        points: bonusPoints,
        type: 'bonus',
        source: 'badge',
        sourceId: userBadge._id,
        sourceModel: 'UserBadge',
        description: `Earned ${badge.name} badge bonus`,
        balanceAfter: user.totalPoints,
      });

      newBadges.push(badge);
    }
  }

  if (newBadges.length > 0) {
    await user.save();
  }

  res.status(200).json({
    success: true,
    count: newBadges.length,
    newBadges,
  });
});