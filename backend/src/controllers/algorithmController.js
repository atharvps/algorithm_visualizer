const SavedAlgorithm = require('../models/SavedAlgorithm');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

// @desc    Get all saved algorithms for user
// @route   GET /api/algorithms
// @access  Private
const getSavedAlgorithms = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    const skip = (page - 1) * limit;

    const filter = { userId: req.user._id };
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const [algorithms, total] = await Promise.all([
      SavedAlgorithm.find(filter)
        .sort({ lastViewed: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      SavedAlgorithm.countDocuments(filter),
    ]);

    return paginatedResponse(res, algorithms, total, page, limit, 'Algorithms fetched');
  } catch (error) {
    return errorResponse(res, 'Failed to fetch algorithms', 500);
  }
};

// @desc    Save or update algorithm
// @route   POST /api/algorithms
// @access  Private
const saveAlgorithm = async (req, res) => {
  try {
    const { algorithmId, name, category, description, notes, timeComplexity, spaceComplexity, tags } = req.body;

    const algorithm = await SavedAlgorithm.findOneAndUpdate(
      { userId: req.user._id, algorithmId },
      {
        name, category, description, notes, timeComplexity, spaceComplexity, tags,
        lastViewed: new Date(),
        $inc: { viewCount: 1 },
        userId: req.user._id,
      },
      { upsert: true, new: true, runValidators: true }
    );

    return successResponse(res, { algorithm }, 'Algorithm saved', 201);
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to save algorithm', 500);
  }
};

// @desc    Get single saved algorithm
// @route   GET /api/algorithms/:id
// @access  Private
const getSavedAlgorithm = async (req, res) => {
  try {
    const algorithm = await SavedAlgorithm.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!algorithm) return errorResponse(res, 'Algorithm not found', 404);
    return successResponse(res, { algorithm }, 'Algorithm fetched');
  } catch (error) {
    return errorResponse(res, 'Failed to fetch algorithm', 500);
  }
};

// @desc    Update saved algorithm notes/tags
// @route   PUT /api/algorithms/:id
// @access  Private
const updateSavedAlgorithm = async (req, res) => {
  try {
    const { notes, tags, description } = req.body;
    const algorithm = await SavedAlgorithm.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { notes, tags, description, lastViewed: new Date() },
      { new: true, runValidators: true }
    );

    if (!algorithm) return errorResponse(res, 'Algorithm not found', 404);
    return successResponse(res, { algorithm }, 'Algorithm updated');
  } catch (error) {
    return errorResponse(res, 'Failed to update algorithm', 500);
  }
};

// @desc    Delete saved algorithm
// @route   DELETE /api/algorithms/:id
// @access  Private
const deleteSavedAlgorithm = async (req, res) => {
  try {
    const algorithm = await SavedAlgorithm.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!algorithm) return errorResponse(res, 'Algorithm not found', 404);
    return successResponse(res, {}, 'Algorithm removed');
  } catch (error) {
    return errorResponse(res, 'Failed to delete algorithm', 500);
  }
};

module.exports = {
  getSavedAlgorithms,
  saveAlgorithm,
  getSavedAlgorithm,
  updateSavedAlgorithm,
  deleteSavedAlgorithm,
};
