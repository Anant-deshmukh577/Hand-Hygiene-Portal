import asyncHandler from '../middleware/asyncHandler.js';
import Observation from '../models/Observation.js';
import Session from '../models/Session.js';
import User from '../models/User.js';
import PointsHistory from '../models/PointsHistory.js';
import Ward from '../models/Ward.js';
import { calculatePoints } from '../utils/helpers.js';
import { sendObservationRecordedEmail } from '../config/emailConfig.js';

// @desc    Get all observations
// @route   GET /api/observations
// @access  Private
export const getObservations = asyncHandler(async (req, res, next) => {
  const { 
    page = 1, 
    limit = 10, 
    session, 
    auditor, 
    department, 
    ward,
    adherence,
    startDate,
    endDate 
  } = req.query;

  const query = {};

  if (session) query.session = session;
  if (auditor) query.auditor = auditor;
  if (department) query.department = department;
  if (ward) query.ward = ward;
  if (adherence) query.adherence = adherence;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const total = await Observation.countDocuments(query);
  const observations = await Observation.find(query)
    .populate('session', 'auditorName ward date')
    .populate('auditor', 'name email')
    .populate('observedStaff', 'name department designation')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: observations.length,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
    observations,
  });
});

// @desc    Get observation by ID
// @route   GET /api/observations/:id
// @access  Private
export const getObservationById = asyncHandler(async (req, res, next) => {
  const observation = await Observation.findById(req.params.id)
    .populate('session', 'auditorName ward date')
    .populate('auditor', 'name email')
    .populate('observedStaff', 'name department designation');

  if (!observation) {
    return res.status(404).json({
      success: false,
      message: 'Observation not found',
    });
  }

  res.status(200).json({
    success: true,
    observation,
  });
});

// @desc    Create observation
// @route   POST /api/observations
// @access  Private/Auditor
export const createObservation = asyncHandler(async (req, res, next) => {
  const {
    session,
    department,
    designation,
    ward,
    whoMoment,
    adherence,
    action,
    glove,
    riskFactors,
    remarks,
    observedStaff,
    hygieneSteps,
    duration,
  } = req.body;

  // Verify session exists and is currently active
  const sessionDoc = await Session.findById(session);
  if (!sessionDoc) {
    return res.status(404).json({
      success: false,
      message: 'Session not found',
    });
  }

  if (sessionDoc.status !== 'active') {
    return res.status(400).json({
      success: false,
      message: 'Session is not active',
    });
  }

  // Create the observation record
  // hygieneSteps + duration are used by the pre('save') hook to calculate points
  const observation = await Observation.create({
    session,
    auditor: req.user.id,
    department,
    designation,
    ward,
    whoMoment,
    adherence,
    action,
    glove,
    riskFactors,
    remarks,
    observedStaff,
    hygieneSteps,
    duration,
  });

  // Increment total observations for this session
  sessionDoc.totalObservations += 1;
  await sessionDoc.save();

  // Update staff member's stats if they were identified
  if (observedStaff) {
    const user = await User.findById(observedStaff);
    if (user) {
      user.totalObservations += 1;
      user.totalPoints += observation.points;

      // Recalculate their overall compliance rate
      const allObservations = await Observation.find({ observedStaff });
      const adherenceCount = allObservations.filter(o => o.adherence === 'adherence').length;
      user.complianceRate = ((adherenceCount / allObservations.length) * 100).toFixed(1);

      await user.save();

      // Log points earned in history (only if points > 0)
      if (observation.points > 0) {
        await PointsHistory.create({
          user: observedStaff,
          points: observation.points,
          type: 'earned',
          source: 'observation',
          sourceId: observation._id,
          sourceModel: 'Observation',
          description: `Earned ${observation.points} points from observation`,
          balanceAfter: user.totalPoints,
        });
      }
    }
  }

  // Send email notification to admin about new observation
  try {
    const auditor = await User.findById(req.user.id);
    // Ward is stored as a name string in observations, not an ObjectId
    const wardDoc = ward ? await Ward.findOne({ name: ward }) : null;
    const adminUsers = await User.find({ role: 'admin', isActive: true });
    
    if (adminUsers.length > 0 && auditor) {
      // Send to all admins
      for (const admin of adminUsers) {
        await sendObservationRecordedEmail(admin.email, observation, auditor, wardDoc);
      }
    }
  } catch (emailError) {
    console.error('❌ Failed to send observation recorded email:', emailError.message);
    // Don't fail the request if email fails
  }

  res.status(201).json({
    success: true,
    observation,
  });
});

// @desc    Update observation
// @route   PUT /api/observations/:id
// @access  Private/Auditor
export const updateObservation = asyncHandler(async (req, res, next) => {
  let observation = await Observation.findById(req.params.id);

  if (!observation) {
    return res.status(404).json({
      success: false,
      message: 'Observation not found',
    });
  }

  // Make sure user is the auditor or admin
  if (observation.auditor.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this observation',
    });
  }

  const updatedObservation = {
    ...observation.toObject(),
    ...req.body,
  };
  updatedObservation.points = calculatePoints(updatedObservation);

  observation = await Observation.findByIdAndUpdate(req.params.id, updatedObservation, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    observation,
  });
});

// @desc    Delete observation
// @route   DELETE /api/observations/:id
// @access  Private/Admin
export const deleteObservation = asyncHandler(async (req, res, next) => {
  const observation = await Observation.findById(req.params.id);

  if (!observation) {
    return res.status(404).json({
      success: false,
      message: 'Observation not found',
    });
  }

  await observation.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Observation deleted successfully',
  });
});

// @desc    Get observations by user
// @route   GET /api/observations/user/:userId
// @access  Private
export const getObservationsByUser = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const total = await Observation.countDocuments({ observedStaff: req.params.userId });
  const observations = await Observation.find({ observedStaff: req.params.userId })
    .populate('session', 'auditorName ward date')
    .populate('auditor', 'name')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: observations.length,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
    observations,
  });
});

// @desc    Get observations by session
// @route   GET /api/observations/session/:sessionId
// @access  Private
export const getObservationsBySession = asyncHandler(async (req, res, next) => {
  const observations = await Observation.find({ session: req.params.sessionId })
    .populate('observedStaff', 'name department designation')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: observations.length,
    observations,
  });
});

// @desc    Bulk create observations
// @route   POST /api/observations/bulk
// @access  Private/Auditor
export const bulkCreateObservations = asyncHandler(async (req, res, next) => {
  const { observations } = req.body;

  if (!observations || !Array.isArray(observations)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an array of observations',
    });
  }

  // Add auditor to each observation
  const observationsWithAuditor = observations.map(obs => {
    const normalized = {
      ...obs,
      auditor: req.user.id,
    };
    normalized.points = calculatePoints(normalized);
    return normalized;
  });
  const createdObservations = await Observation.insertMany(observationsWithAuditor);
  res.status(201).json({
    success: true,
    count: createdObservations.length,
    observations: createdObservations,
  });
});
