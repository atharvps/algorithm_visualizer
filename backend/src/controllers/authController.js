const User = require('../models/User');
const { generateTokenPair, verifyRefreshToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      return errorResponse(res, `${field} is already taken.`, 409);
    }

    // Create user
    const user = await User.create({ username, email, password });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    return successResponse(
      res,
      {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
      'Account created successfully',
      201
    );
  } catch (error) {
    console.error('[Register Error]', error);
    return errorResponse(res, error.message || 'Registration failed', 500);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Account deactivated. Contact support.', 403);
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(user._id);

    // Update user
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    user.stats.totalSessions = (user.stats.totalSessions || 0) + 1;
    await user.save({ validateBeforeSave: false });

    return successResponse(
      res,
      {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
      'Login successful'
    );
  } catch (error) {
    console.error('[Login Error]', error);
    return errorResponse(res, 'Login failed', 500);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (requires refresh token)
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return errorResponse(res, 'Refresh token required', 400);
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== token) {
      return errorResponse(res, 'Invalid refresh token', 401);
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(user._id);
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return successResponse(res, { accessToken, refreshToken: newRefreshToken }, 'Token refreshed');
  } catch (error) {
    return errorResponse(res, 'Token refresh failed', 401);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    return successResponse(res, {}, 'Logged out successfully');
  } catch (error) {
    return errorResponse(res, 'Logout failed', 500);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return successResponse(res, { user }, 'User fetched');
  } catch (error) {
    return errorResponse(res, 'Failed to fetch user', 500);
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { bio, avatar, preferences } = req.body;
    const updates = {};
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;
    if (preferences) updates.preferences = { ...req.user.preferences, ...preferences };

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, { user }, 'Profile updated');
  } catch (error) {
    return errorResponse(res, 'Update failed', 500);
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return errorResponse(res, 'Current password is incorrect', 400);
    }

    user.password = newPassword;
    await user.save();

    return successResponse(res, {}, 'Password changed successfully');
  } catch (error) {
    return errorResponse(res, 'Password change failed', 500);
  }
};

module.exports = { register, login, refreshToken, logout, getMe, updateProfile, changePassword };
