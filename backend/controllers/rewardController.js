import asyncHandler from '../middleware/asyncHandler.js';
import Reward from '../models/Reward.js';
import UserReward from '../models/UserReward.js';
import User from '../models/User.js';
import PointsHistory from '../models/PointsHistory.js';
import { 
  sendRewardClaimedEmail, 
  sendRewardClaimedAdminEmail,
  sendRewardApprovedEmail,
  sendRewardRejectedEmail 
} from '../config/emailConfig.js';

// @desc    Get all rewards
// @route   GET /api/rewards
// @access  Private
export const getRewards = asyncHandler(async (req, res, next) => {
  const { isActive, category } = req.query;

  const query = {};
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (category) query.category = category;

  const rewards = await Reward.find(query).sort({ pointsRequired: 1 });

  res.status(200).json({
    success: true,
    count: rewards.length,
    rewards,
  });
});

// @desc    Get reward by ID
// @route   GET /api/rewards/:id
// @access  Private
export const getRewardById = asyncHandler(async (req, res, next) => {
  const reward = await Reward.findById(req.params.id);

  if (!reward) {
    return res.status(404).json({
      success: false,
      message: 'Reward not found',
    });
  }

  res.status(200).json({
    success: true,
    reward,
  });
});

// @desc    Create reward (Admin)
// @route   POST /api/rewards
// @access  Private/Admin
export const createReward = asyncHandler(async (req, res, next) => {
  const reward = await Reward.create(req.body);

  res.status(201).json({
    success: true,
    reward,
  });
});

// @desc    Update reward (Admin)
// @route   PUT /api/rewards/:id
// @access  Private/Admin
export const updateReward = asyncHandler(async (req, res, next) => {
  let reward = await Reward.findById(req.params.id);

  if (!reward) {
    return res.status(404).json({
      success: false,
      message: 'Reward not found',
    });
  }

  reward = await Reward.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    reward,
  });
});

// @desc    Delete reward (Admin)
// @route   DELETE /api/rewards/:id
// @access  Private/Admin
export const deleteReward = asyncHandler(async (req, res, next) => {
  const reward = await Reward.findById(req.params.id);

  if (!reward) {
    return res.status(404).json({
      success: false,
      message: 'Reward not found',
    });
  }

  await reward.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Reward deleted successfully',
  });
});

// @desc    Claim reward
// @route   POST /api/rewards/:id/claim
// @access  Private
export const claimReward = asyncHandler(async (req, res, next) => {
  const reward = await Reward.findById(req.params.id);

  if (!reward) {
    return res.status(404).json({
      success: false,
      message: 'Reward not found',
    });
  }

  // Check if reward is available
  if (!reward.isAvailable()) {
    return res.status(400).json({
      success: false,
      message: 'Reward is not available',
    });
  }

  const user = await User.findById(req.user.id);

  // Check if user has enough points
  if (user.totalPoints < reward.pointsRequired) {
    return res.status(400).json({
      success: false,
      message: 'Insufficient points',
    });
  }

  // Deduct points
  user.totalPoints -= reward.pointsRequired;
  await user.save();

  // Create user reward
  const userReward = await UserReward.create({
    user: user._id,
    reward: reward._id,
    pointsSpent: reward.pointsRequired,
  });

  // Update reward claimed count
  reward.claimedCount += 1;
  await reward.save();

  // Create points history
  await PointsHistory.create({
    user: user._id,
    points: -reward.pointsRequired,
    type: 'spent',
    source: 'reward',
    sourceId: userReward._id,
    sourceModel: 'UserReward',
    description: `Claimed reward: ${reward.title}`,
    balanceAfter: user.totalPoints,
  });

  // Send email notifications (don't block response if email fails)
  try {
    // Send email to user
    await sendRewardClaimedEmail(user, reward, userReward);
    
    // Send email to admin
    const adminUsers = await User.find({ role: 'admin', isActive: true });
    if (adminUsers.length > 0) {
      // Send to first admin or all admins
      for (const admin of adminUsers) {
        await sendRewardClaimedAdminEmail(admin.email, user, reward, userReward);
      }
    }
  } catch (emailError) {
    console.error('❌ Failed to send reward claimed email:', emailError.message);
    // Don't fail the request if email fails
  }

  res.status(201).json({
    success: true,
    message: 'Reward claimed successfully',
    userReward,
  });
});

// @desc    Get user rewards
// @route   GET /api/rewards/user/:userId
// @access  Private
export const getUserRewards = asyncHandler(async (req, res, next) => {
  const { status } = req.query;

  const query = { user: req.params.userId };
  if (status) query.status = status;

  const userRewards = await UserReward.find(query)
    .populate('reward')
    .sort({ claimedAt: -1 });

  res.status(200).json({
    success: true,
    count: userRewards.length,
    rewards: userRewards,
  });
});

// @desc    Get points history
// @route   GET /api/rewards/user/:userId/history
// @access  Private
export const getPointsHistory = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;

  const total = await PointsHistory.countDocuments({ user: req.params.userId });
  const history = await PointsHistory.find({ user: req.params.userId })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: history.length,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
    history,
  });
});

// @desc    Approve user reward (Admin)
// @route   PUT /api/rewards/user-reward/:id/approve
// @access  Private/Admin
export const approveUserReward = asyncHandler(async (req, res, next) => {
  const userReward = await UserReward.findById(req.params.id).populate('user reward');

  if (!userReward) {
    return res.status(404).json({
      success: false,
      message: 'User reward not found',
    });
  }

  if (userReward.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'Reward has already been processed',
    });
  }

  // Generate unique reward code for tracking
  const rewardCode = `RWD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  // Update reward status and metadata
  userReward.status = 'approved';
  userReward.approvedBy = req.user.id;
  userReward.approvedAt = Date.now();
  userReward.rewardCode = rewardCode;
  userReward.notes = req.body.notes || '';

  await userReward.save();

  // Send email notification to user about approval
  try {
    const userDoc = await User.findById(userReward.user._id || userReward.user);
    const rewardDoc = userReward.reward;
    if (userDoc && rewardDoc) {
      await sendRewardApprovedEmail(userDoc, rewardDoc, userReward);
    }
  } catch (emailError) {
    console.error('❌ Failed to send reward approved email:', emailError.message);
    // Don't fail the request if email fails
  }

  res.status(200).json({
    success: true,
    message: 'Reward approved successfully',
    userReward,
  });
});

// @desc    Reject user reward (Admin)
// @route   PUT /api/rewards/user-reward/:id/reject
// @access  Private/Admin
export const rejectUserReward = asyncHandler(async (req, res, next) => {
  const userReward = await UserReward.findById(req.params.id).populate('user reward');

  if (!userReward) {
    return res.status(404).json({
      success: false,
      message: 'User reward not found',
    });
  }

  if (userReward.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'Reward has already been processed',
    });
  }

  const user = await User.findById(userReward.user._id || userReward.user);

  // Refund points back to user's account
  user.totalPoints += userReward.pointsSpent;
  await user.save();

  // Mark reward as rejected with admin details
  userReward.status = 'rejected';
  userReward.approvedBy = req.user.id;
  userReward.approvedAt = Date.now();
  userReward.notes = req.body.notes || 'Rejected by admin';

  await userReward.save();

  // Log the refund in points history for transparency
  await PointsHistory.create({
    user: user._id,
    points: userReward.pointsSpent,
    type: 'earned',
    source: 'refund',
    sourceId: userReward._id,
    sourceModel: 'UserReward',
    description: `Refund for rejected reward: ${userReward.reward.title || 'Reward'}`,
    balanceAfter: user.totalPoints,
  });

  // Send email notification to user about rejection
  try {
    const rewardDoc = userReward.reward;
    if (user && rewardDoc) {
      await sendRewardRejectedEmail(user, rewardDoc, userReward);
    }
  } catch (emailError) {
    console.error('❌ Failed to send reward rejected email:', emailError.message);
    // Don't fail the request if email fails
  }

  res.status(200).json({
    success: true,
    message: 'Reward rejected and points refunded',
    userReward,
    refundedPoints: userReward.pointsSpent,
  });
});

// @desc    Get pending rewards (Admin)
// @route   GET /api/rewards/pending
// @access  Private/Admin
export const getPendingRewards = asyncHandler(async (req, res, next) => {
  const pendingRewards = await UserReward.find({ status: 'pending' })
    .populate('user', 'name email department')
    .populate('reward', 'title description pointsRequired')
    .sort({ claimedAt: -1 });

  res.status(200).json({
    success: true,
    count: pendingRewards.length,
    rewards: pendingRewards,
  });
});