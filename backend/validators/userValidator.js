import { body, param } from 'express-validator';

export const updateUserValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian phone number'),
  
  body('department')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Department cannot be empty'),
  
  body('designation')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Designation cannot be empty'),
];

export const userIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID'),
];

export const changePasswordValidator = [
  body('currentPassword')
    .optional() // Make optional - will be checked conditionally in controller
    .isString()
    .withMessage('Current password must be a string'),
  
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

// Avatar upload validator - validates file from request
export const avatarUploadValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID'),
];