import asyncHandler from '../middleware/asyncHandler.js';
import Session from '../models/Session.js';
import Observation from '../models/Observation.js';

// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Private
export const getSessions = asyncHandler(async (req, res, next) => {
  const { 
    page = 1, 
    limit = 10, 
    auditor, 
    ward, 
    status,
    startDate,
    endDate 
  } = req.query;

  const query = {};

  if (auditor) query.auditor = auditor;
  if (ward) query.ward = ward;
  if (status) query.status = status;

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const total = await Session.countDocuments(query);
  const sessions = await Session.find(query)
    .populate('auditor', 'name email')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: sessions.length,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
    sessions,
  });
});

// @desc    Get session by ID
// @route   GET /api/sessions/:id
// @access  Private
export const getSessionById = asyncHandler(async (req, res, next) => {
  const session = await Session.findById(req.params.id)
    .populate('auditor', 'name email')
    .populate('observations');

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found',
    });
  }

  res.status(200).json({
    success: true,
    session,
  });
});

// @desc    Create session
// @route   POST /api/sessions
// @access  Private/Auditor
export const createSession = asyncHandler(async (req, res, next) => {
  const { auditorName, ward, date, startTime, notes } = req.body;

  const session = await Session.create({
    auditorName,
    auditor: req.user.id,
    ward,
    date,
    startTime,
    notes,
  });

  res.status(201).json({
    success: true,
    session,
  });
});

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private/Auditor
export const updateSession = asyncHandler(async (req, res, next) => {
  let session = await Session.findById(req.params.id);

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found',
    });
  }

  // Make sure user is the auditor or admin
  if (session.auditor.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this session',
    });
  }

  session = await Session.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    session,
  });
});

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private/Admin
export const deleteSession = asyncHandler(async (req, res, next) => {
  const session = await Session.findById(req.params.id);

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found',
    });
  }

  // Delete all observations associated with this session
  await Observation.deleteMany({ session: session._id });

  await session.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Session and associated observations deleted successfully',
  });
});

// @desc    End session
// @route   POST /api/sessions/:id/end
// @access  Private/Auditor
export const endSession = asyncHandler(async (req, res, next) => {
  const session = await Session.findById(req.params.id);

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found',
    });
  }

  // Make sure user is the auditor or admin
  if (session.auditor.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to end this session',
    });
  }

  if (session.status !== 'active') {
    return res.status(400).json({
      success: false,
      message: 'Session is not active',
    });
  }

  session.status = 'completed';
  session.endTime = req.body.endTime || new Date().toTimeString().slice(0, 5);
  await session.save();

  res.status(200).json({
    success: true,
    session,
  });
});

// @desc    Get active sessions
// @route   GET /api/sessions/active
// @access  Private
export const getActiveSessions = asyncHandler(async (req, res, next) => {
  const sessions = await Session.find({ status: 'active' })
    .populate('auditor', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: sessions.length,
    sessions,
  });
});