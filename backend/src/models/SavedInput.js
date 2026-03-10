const mongoose = require('mongoose');

const savedInputSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    label: {
      type: String,
      required: [true, 'Label is required'],
      trim: true,
      maxlength: [80, 'Label cannot exceed 80 characters'],
    },
    algorithmCategory: {
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
      ],
    },
    inputType: {
      type: String,
      required: true,
      enum: ['array', 'graph', 'tree', 'string', 'matrix', 'custom'],
    },
    data: {
      // Array input
      array: [mongoose.Schema.Types.Mixed],
      // Graph input
      nodes: [
        {
          id: String,
          label: String,
          x: Number,
          y: Number,
        },
      ],
      edges: [
        {
          source: String,
          target: String,
          weight: Number,
        },
      ],
      // String input
      text: String,
      pattern: String,
      // Matrix input
      matrix: [[mongoose.Schema.Types.Mixed]],
      // Custom JSON
      custom: mongoose.Schema.Types.Mixed,
    },
    generatorType: {
      type: String,
      enum: ['random', 'sorted', 'reverse-sorted', 'nearly-sorted', 'few-unique', 'custom'],
      default: 'custom',
    },
    arraySize: {
      type: Number,
      min: 1,
      max: 500,
    },
    metadata: {
      speed: Number,
      arraySize: Number,
      notes: String,
    },
  },
  {
    timestamps: true,
  }
);

savedInputSchema.index({ userId: 1, algorithmCategory: 1 });

const SavedInput = mongoose.model('SavedInput', savedInputSchema);
module.exports = SavedInput;
