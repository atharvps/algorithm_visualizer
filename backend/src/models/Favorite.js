const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
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
      required: true,
      trim: true,
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
    timeComplexity: {
      best: String,
      average: String,
      worst: String,
    },
    spaceComplexity: String,
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: '',
    },
    tags: [{ type: String, trim: true }],
    pinnedAt: {
      type: Date,
      default: null,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate favorites
favoriteSchema.index({ userId: 1, algorithmId: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;
