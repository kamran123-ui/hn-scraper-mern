const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {
    title: {
      type:     String,
      required: [true, 'Title is required'],
      trim:     true,
    },
    url: {
      type:    String,
      default: '',
      trim:    true,
    },
    points: {
      type:    Number,
      default: 0,
      min:     0,
    },
    author: {
      type:    String,
      default: 'unknown',
      trim:    true,
    },
    postedAt: {
      type:    String,
      default: '',
    },
    hnId: {
      type:   String,
      unique: true,
      sparse: true,
      index:  true,
    },
  },
  { timestamps: true }
);

// Index for sorting by points
storySchema.index({ points: -1 });

module.exports = mongoose.model('Story', storySchema);
