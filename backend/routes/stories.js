const express = require('express');
const router = express.Router();
const {
  getAllStories,
  getStoryById,
  toggleBookmark,
  getBookmarkedStories,
} = require('../controllers/storyController');
const { protect } = require('../middleware/auth');

router.get('/', getAllStories);
router.get('/bookmarks', protect, getBookmarkedStories);
router.get('/:id', getStoryById);
router.post('/:id/bookmark', protect, toggleBookmark);

module.exports = router;
