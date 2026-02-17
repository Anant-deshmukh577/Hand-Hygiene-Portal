import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import Observation from '../models/Observation.js';
import Department from '../models/Department.js';
import Ward from '../models/Ward.js';

// @desc    Get leaderboard
// @route   GET /api/leaderboard
// @access  Private
export const getLeaderboard = asyncHandler(async (req, res, next) => {
  const { 
    timePeriod = 'weekly', 
    department, 
    ward,
    limit = 20 
  } = req.query;

  // Calculate date range based on time period
  let startDate;
  const endDate = new Date();

  switch (timePeriod) {
    case 'daily':
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'weekly':
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'monthly':
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'all_time':
      startDate = new Date(0); // Beginning of time
      break;
    default:
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
  }

  // Build query
  const query = { isActive: true };
  if (department && department !== 'all') query.department = department;

  // Get users with fresh data (not lean to ensure we get latest from DB)
  let users = await User.find(query)
    .select('name email department designation totalPoints complianceRate totalObservations avatar');

  // Convert to plain objects for manipulation
  users = users.map(u => u.toObject());

  // If time period is not all_time, calculate PERIOD-SPECIFIC stats for additional info
  if (timePeriod !== 'all_time') {
    const observationQuery = {
      createdAt: { $gte: startDate, $lte: endDate },
    };

    if (ward && ward !== 'all') observationQuery.ward = ward;

    for (let user of users) {
      const observations = await Observation.find({
        ...observationQuery,
        observedStaff: user._id,
      });

      // Calculate period-specific stats for additional display info
      const periodPoints = observations.reduce((sum, obs) => sum + obs.points, 0);
      const adherenceCount = observations.filter(o => o.adherence === 'adherence').length;
      const periodCompliance = observations.length > 0 
        ? ((adherenceCount / observations.length) * 100).toFixed(1)
        : 0;

      user.periodPoints = periodPoints;
      user.periodObservations = observations.length;
      user.periodCompliance = parseFloat(periodCompliance);
    }
  }

  // ALWAYS sort by actual totalPoints (includes reward deductions)
  // This ensures ranking reflects true point balance
  users.sort((a, b) => b.totalPoints - a.totalPoints);

  // Add rank
  users = users.slice(0, limit).map((user, index) => ({
    ...user,
    rank: index + 1,
  }));

  res.status(200).json({
    success: true,
    count: users.length,
    timePeriod,
    leaderboard: users,
  });
});

// @desc    Get department rankings
// @route   GET /api/leaderboard/departments
// @access  Private
export const getDepartmentRankings = asyncHandler(async (req, res, next) => {
  const { timePeriod = 'weekly' } = req.query;

  // Calculate date range
  let startDate;
  switch (timePeriod) {
    case 'daily':
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'weekly':
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'monthly':
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    default:
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
  }

  const departments = await User.distinct('department');
  const rankings = [];

  for (const dept of departments) {
    const users = await User.find({ department: dept, isActive: true });
    const userIds = users.map(u => u._id);

    const observations = await Observation.find({
      observedStaff: { $in: userIds },
      createdAt: { $gte: startDate },
    });

    if (observations.length > 0) {
      const totalPoints = observations.reduce((sum, obs) => sum + obs.points, 0);
      const adherenceCount = observations.filter(o => o.adherence === 'adherence').length;
      const complianceRate = ((adherenceCount / observations.length) * 100).toFixed(1);

      rankings.push({
        name: dept,
        totalStaff: users.length,
        totalObservations: observations.length,
        averagePoints: (totalPoints / users.length).toFixed(2),
        complianceRate: parseFloat(complianceRate),
      });
    }
  }

  rankings.sort((a, b) => b.averagePoints - a.averagePoints);

  res.status(200).json({
    success: true,
    count: rankings.length,
    rankings,
  });
});

// @desc    Get ward rankings
// @route   GET /api/leaderboard/wards
// @access  Private
export const getWardRankings = asyncHandler(async (req, res, next) => {
  const { timePeriod = 'weekly' } = req.query;

  // Calculate date range
  let startDate;
  switch (timePeriod) {
    case 'daily':
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'weekly':
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'monthly':
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    default:
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
  }

  const wards = await Observation.distinct('ward');
  const rankings = [];

  for (const ward of wards) {
    const observations = await Observation.find({
      ward,
      createdAt: { $gte: startDate },
    });

    if (observations.length > 0) {
      const adherenceCount = observations.filter(o => o.adherence === 'adherence').length;
      const complianceRate = ((adherenceCount / observations.length) * 100).toFixed(1);

      rankings.push({
        name: ward,
        totalObservations: observations.length,
        complianceRate: parseFloat(complianceRate),
      });
    }
  }

  rankings.sort((a, b) => b.complianceRate - a.complianceRate);

  res.status(200).json({
    success: true,
    count: rankings.length,
    rankings,
  });
});

// @desc    Get user rank
// @route   GET /api/leaderboard/user/:userId/rank
// @access  Private
export const getUserRank = asyncHandler(async (req, res, next) => {
  const { timePeriod = 'weekly' } = req.query;

  // Get all users sorted by points (not using .lean() to get fresh data)
  const users = await User.find({ isActive: true })
    .select('_id totalPoints')
    .sort({ totalPoints: -1 });

  const userIndex = users.findIndex(u => u._id.toString() === req.params.userId);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'User not found in rankings',
    });
  }

  res.status(200).json({
    success: true,
    rank: userIndex + 1,
    totalUsers: users.length,
  });
});

// @desc    Get top performers
// @route   GET /api/leaderboard/top
// @access  Private
export const getTopPerformers = asyncHandler(async (req, res, next) => {
  const { limit = 10, timePeriod = 'weekly' } = req.query;

  // Get fresh data from database (not using .lean())
  const users = await User.find({ isActive: true })
    .select('name department designation totalPoints complianceRate avatar')
    .sort({ totalPoints: -1 })
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: users.length,
    performers: users,
  });
});