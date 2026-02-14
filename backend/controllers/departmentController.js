import asyncHandler from '../middleware/asyncHandler.js';
import Department from '../models/Department.js';

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private
export const getDepartments = asyncHandler(async (req, res, next) => {
  const departments = await Department.find({ isActive: true })
    .select('name code')
    .sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: departments.length,
    departments,
  });
});
