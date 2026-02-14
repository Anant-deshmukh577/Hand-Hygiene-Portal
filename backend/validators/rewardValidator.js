import { body, param } from 'express-validator';

export const createRewardValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Reward title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('pointsRequired')
    .notEmpty()
    .withMessage('Points required is required')
    .isInt({ min: 1 })
    .withMessage('Points must be at least 1'),
  
  body('category')
    .optional()
    .isIn(['voucher', 'time_off', 'gift', 'training', 'parking', 'other'])
    .withMessage('Invalid category'),
  
  body('quantity')
    .optional()
    .isInt({ min: -1 })
    .withMessage('Quantity must be -1 (unlimited) or a positive number'),
];

export const rewardIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid reward ID'),
];