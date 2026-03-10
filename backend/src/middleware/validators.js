const { body, param, query, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(
      res,
      'Validation failed',
      400,
      errors.array().map((e) => ({ field: e.path, message: e.msg }))
    );
  }
  next();
};

// Auth validators
const registerValidators = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3-30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
];

const loginValidators = [
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Algorithm validators
const savedAlgorithmValidators = [
  body('algorithmId').trim().notEmpty().withMessage('Algorithm ID required'),
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name required (max 100 chars)'),
  body('category').isIn([
    'sorting', 'searching', 'graph', 'tree', 'linkedlist',
    'stackqueue', 'dynamic-programming', 'sliding-window', 'recursion', 'string', 'complexity',
  ]).withMessage('Invalid category'),
];

// Input validators
const savedInputValidators = [
  body('label').trim().isLength({ min: 1, max: 80 }).withMessage('Label required (max 80 chars)'),
  body('algorithmCategory').notEmpty().withMessage('Algorithm category required'),
  body('inputType').isIn(['array', 'graph', 'tree', 'string', 'matrix', 'custom']).withMessage('Invalid input type'),
  body('data').notEmpty().withMessage('Data is required'),
];

// Favorite validators
const favoriteValidators = [
  body('algorithmId').trim().notEmpty().withMessage('Algorithm ID required'),
  body('name').trim().notEmpty().withMessage('Name required'),
  body('category').notEmpty().withMessage('Category required'),
];

// Pagination validators
const paginationValidators = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
];

module.exports = {
  validate,
  registerValidators,
  loginValidators,
  savedAlgorithmValidators,
  savedInputValidators,
  favoriteValidators,
  paginationValidators,
};
