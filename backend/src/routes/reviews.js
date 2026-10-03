const express = require('express');
const router = express.Router();
const { protect, managerReadOnly } = require('../middleware/auth');
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

router
  .route('/')
  .get(getReviews)
  .post(protect, managerReadOnly, addReview);

router
  .route('/:id')
  .get(getReview)
  .put(protect, managerReadOnly, updateReview)
  .delete(protect, managerReadOnly, deleteReview);

module.exports = router;
