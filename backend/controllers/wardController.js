import asyncHandler from '../middleware/asyncHandler.js';
import Ward from '../models/Ward.js';
import Observation from '../models/Observation.js';

// @desc    Get all wards
// @route   GET /api/wards
// @access  Private
export const getWards = asyncHandler(async (req, res, next) => {
  const { isActive } = req.query;

  const query = {};
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const wards = await Ward.find(query).sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: wards.length,
    wards,
  });
});

// @desc    Get ward by ID
// @route   GET /api/wards/:id
// @access  Private
export const getWardById = asyncHandler(async (req, res, next) => {
  const ward = await Ward.findById(req.params.id);

  if (!ward) {
    return res.status(404).json({
      success: false,
      message: 'Ward not found',
    });
  }

  res.status(200).json({
    success: true,
    ward,
  });
});

// @desc    Create ward (Admin)
// @route   POST /api/wards
// @access  Private/Admin
export const createWard = asyncHandler(async (req, res, next) => {
  const ward = await Ward.create(req.body);

  res.status(201).json({
    success: true,
    ward,
  });
});

// @desc    Update ward (Admin)
// @route   PUT /api/wards/:id
// @access  Private/Admin
export const updateWard = asyncHandler(async (req, res, next) => {
  let ward = await Ward.findById(req.params.id);

  if (!ward) {
    return res.status(404).json({
      success: false,
      message: 'Ward not found',
    });
  }

  ward = await Ward.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    ward,
  });
});

// @desc    Delete ward (Admin)
// @route   DELETE /api/wards/:id
// @access  Private/Admin
export const deleteWard = asyncHandler(async (req, res, next) => {
  const ward = await Ward.findById(req.params.id);

  if (!ward) {
    return res.status(404).json({
      success: false,
      message: 'Ward not found',
    });
  }

  // Check if ward has any sessions/observations
  const sessionsCount = await Observation.countDocuments({ ward: ward._id });

  if (sessionsCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete ward. It has ${sessionsCount} observation(s) associated with it.`,
    });
  }

  await ward.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Ward deleted successfully',
  });
});