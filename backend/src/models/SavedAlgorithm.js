const mongoose = require('mongoose');

const savedAlgorithmSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    algorithmId: {
      type: String,
      required: [true, 'Algorithm ID is required'],
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Algorithm name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'sorting',
        'searching',
        'graph',
        'tree',
        'linkedlist',
        'stackqueue',
        'dynamic-programming',
        'sliding-window',
        'recursion',
        'string',
        'complexity',
      ],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    notes: {
      type: String,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
      default: '',
    },
    timeComplexity: {
      best: String,
      average: String,
      worst: String,
    },
    spaceComplexity: String,
    tags: [{ type: String, trim: true }],
    lastViewed: {
      type: Date,
      default: Date.now,
    },
    viewCount: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user + algorithm uniqueness
savedAlgorithmSchema.index({ userId: 1, algorithmId: 1 }, { unique: true });

const SavedAlgorithm = mongoose.model('SavedAlgorithm', savedAlgorithmSchema);
module.exports = SavedAlgorithm;
