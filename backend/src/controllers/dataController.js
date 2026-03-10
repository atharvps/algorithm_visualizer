const SavedInput = require('../models/SavedInput');
const Favorite = require('../models/Favorite');
const User = require('../models/User');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

// ======================== INPUTS CONTROLLER ========================

const getSavedInputs = async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const skip = (page - 1) * limit;
    const filter = { userId: req.user._id };
    if (category) filter.algorithmCategory = category;

    const [inputs, total] = await Promise.all([
      SavedInput.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      SavedInput.countDocuments(filter),
    ]);

    return paginatedResponse(res, inputs, total, page, limit, 'Inputs fetched');
  } catch (error) {
    return errorResponse(res, 'Failed to fetch inputs', 500);
  }
};

const saveInput = async (req, res) => {
  try {
    const input = await SavedInput.create({ ...req.body, userId: req.user._id });
    return successResponse(res, { input }, 'Input saved', 201);
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to save input', 500);
  }
};

const getSavedInput = async (req, res) => {
  try {
    const input = await SavedInput.findOne({ _id: req.params.id, userId: req.user._id });
    if (!input) return errorResponse(res, 'Input not found', 404);
    return successResponse(res, { input }, 'Input fetched');
  } catch (error) {
    return errorResponse(res, 'Failed to fetch input', 500);
  }
};

const updateSavedInput = async (req, res) => {
  try {
    const input = await SavedInput.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!input) return errorResponse(res, 'Input not found', 404);
    return successResponse(res, { input }, 'Input updated');
  } catch (error) {
    return errorResponse(res, 'Failed to update input', 500);
  }
};

const deleteSavedInput = async (req, res) => {
  try {
    const input = await SavedInput.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!input) return errorResponse(res, 'Input not found', 404);
    return successResponse(res, {}, 'Input deleted');
  } catch (error) {
    return errorResponse(res, 'Failed to delete input', 500);
  }
};

// ======================== FAVORITES CONTROLLER ========================

const getFavorites = async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const skip = (page - 1) * limit;
    const filter = { userId: req.user._id };
    if (category) filter.category = category;

    const [favorites, total] = await Promise.all([
      Favorite.find(filter).sort({ isPinned: -1, createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Favorite.countDocuments(filter),
    ]);

    return paginatedResponse(res, favorites, total, page, limit, 'Favorites fetched');
  } catch (error) {
    return errorResponse(res, 'Failed to fetch favorites', 500);
  }
};

const addFavorite = async (req, res) => {
  try {
    const { algorithmId, name, category, timeComplexity, spaceComplexity, notes, tags } = req.body;

    const existing = await Favorite.findOne({ userId: req.user._id, algorithmId });
    if (existing) return errorResponse(res, 'Already in favorites', 409);

    const favorite = await Favorite.create({
      userId: req.user._id,
      algorithmId, name, category, timeComplexity, spaceComplexity, notes, tags,
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { 'stats.favoriteCount': 1 } });

    return successResponse(res, { favorite }, 'Added to favorites', 201);
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to add favorite', 500);
  }
};

const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!favorite) return errorResponse(res, 'Favorite not found', 404);

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.favoriteCount': -1 },
    });

    return successResponse(res, {}, 'Removed from favorites');
  } catch (error) {
    return errorResponse(res, 'Failed to remove favorite', 500);
  }
};

const toggleFavoritePin = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({ _id: req.params.id, userId: req.user._id });
    if (!favorite) return errorResponse(res, 'Favorite not found', 404);

    favorite.isPinned = !favorite.isPinned;
    favorite.pinnedAt = favorite.isPinned ? new Date() : null;
    await favorite.save();

    return successResponse(res, { favorite }, `Favorite ${favorite.isPinned ? 'pinned' : 'unpinned'}`);
  } catch (error) {
    return errorResponse(res, 'Failed to toggle pin', 500);
  }
};

const checkFavorite = async (req, res) => {
  try {
    const { algorithmId } = req.params;
    const favorite = await Favorite.findOne({ userId: req.user._id, algorithmId });
    return successResponse(res, { isFavorite: !!favorite, favorite }, 'Status fetched');
  } catch (error) {
    return errorResponse(res, 'Failed to check favorite', 500);
  }
};

module.exports = {
  getSavedInputs, saveInput, getSavedInput, updateSavedInput, deleteSavedInput,
  getFavorites, addFavorite, removeFavorite, toggleFavoritePin, checkFavorite,
};
