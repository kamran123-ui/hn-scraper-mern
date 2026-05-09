const Story = require('../models/Story');
const User  = require('../models/User');

// ─── GET /api/stories?page=1&limit=10 ────────────────────────────────────────
const getAllStories = async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    const [stories, total] = await Promise.all([
      Story.find().sort({ points: -1 }).skip(skip).limit(limit).lean(),
      Story.countDocuments(),
    ]);

    res.json({
      stories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/stories/bookmarks ──────────────────────────────────────────────
const getBookmarkedStories = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({ path: 'bookmarks', options: { sort: { points: -1 } } })
      .lean();

    res.json({ stories: user.bookmarks || [] });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/stories/:id ────────────────────────────────────────────────────
const getStoryById = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id).lean();
    if (!story) {
      return res.status(404).json({ message: 'Story not found.' });
    }
    res.json({ story });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/stories/:id/bookmark ─────────────────────────────────────────
const toggleBookmark = async (req, res, next) => {
  try {
    const storyId = req.params.id;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found.' });
    }

    const user        = await User.findById(req.user._id);
    const isBookmarked = user.bookmarks.some((id) => id.toString() === storyId);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((id) => id.toString() !== storyId);
    } else {
      user.bookmarks.push(storyId);
    }

    await user.save();

    res.json({
      message:    isBookmarked ? 'Bookmark removed' : 'Bookmark added',
      bookmarked: !isBookmarked,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllStories, getBookmarkedStories, getStoryById, toggleBookmark };
