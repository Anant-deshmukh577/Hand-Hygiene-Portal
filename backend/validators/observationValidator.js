import { body, param } from 'express-validator';

export const createObservationValidator = [
  body('session')
    .notEmpty()
    .withMessage('Session ID is required')
    .isMongoId()
    .withMessage('Invalid session ID'),
  
  body('department')
    .trim()
    .notEmpty()
    .withMessage('Department is required'),
  
  body('designation')
    .trim()
    .notEmpty()
    .withMessage('Designation is required'),
  
  body('ward')
    .trim()
    .notEmpty()
    .withMessage('Ward is required'),
  
  body('whoMoment')
    .trim()
    .notEmpty()
    .withMessage('WHO Moment is required')
    .isIn(['before_patient', 'before_aseptic', 'after_body_fluid', 'after_patient', 'after_surroundings'])
    .withMessage('Invalid WHO Moment'),
  
  body('adherence')
    .trim()
    .notEmpty()
    .withMessage('Adherence status is required')
    .isIn(['adherence', 'partial', 'missed'])
    .withMessage('Invalid adherence status'),
  
  body('action')
    .trim()
    .notEmpty()
    .withMessage('Action is required')
    .isIn(['rub', 'wash'])
    .withMessage('Invalid action'),
  
  body('glove')
    .optional()
    .isIn(['on', 'off'])
    .withMessage('Invalid glove status'),

  body('observedStaff')
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId()
    .withMessage('Invalid observed staff ID'),
  
  body('remarks')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Remarks cannot exceed 500 characters'),
];

export const observationIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid observation ID'),
];
