const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const { errorResponse } = require('../utils/response');

const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header or cookie
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return errorResponse(res, 'Access denied. No token provided.', 401);
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    if (decoded.type !== 'access') {
      return errorResponse(res, 'Invalid token type.', 401);
    }

    // Find user
    const user = await User.findById(decoded.id).select('-password -refreshToken');
    if (!user) {
      return errorResponse(res, 'User not found. Token invalid.', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Account deactivated. Contact support.', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token.', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired. Please refresh.', 401);
    }
    return errorResponse(res, 'Authentication failed.', 500);
  }
};

// Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id).select('-password -refreshToken');
      if (user && user.isActive) req.user = user;
    }
  } catch {}
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return errorResponse(res, 'Admin access required.', 403);
  }
  next();
};

module.exports = { protect, optionalAuth, adminOnly };
