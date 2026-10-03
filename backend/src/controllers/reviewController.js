const Review = require('../models/Review');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const { col, fn } = require('sequelize');
const serializeModel = require('../utils/modelJson');
const asyncHandler = require('express-async-handler');

const updateVehicleRating = async (vehicleId) => {
  const stats = await Review.findOne({
    where: { vehicle: vehicleId },
    attributes: [
      [fn('AVG', col('rating')), 'averageRating'],
      [fn('COUNT', col('id')), 'numReviews'],
    ],
    raw: true,
  });
  await Vehicle.update(
    {
      rating: Number(stats?.averageRating) || 0,
      numReviews: Number(stats?.numReviews) || 0,
    },
    { where: { id: vehicleId } }
  );
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.findAll({
    include: [{ model: User, as: 'reviewer', attributes: ['id', 'name'] }],
  });
  res.json(reviews.map((review) => serializeModel(review, { reviewer: 'user' })));
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res) => {
  const review = await Review.findByPk(req.params.id, {
    include: [{ model: User, as: 'reviewer', attributes: ['id', 'name'] }],
  });
  
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  
  res.json(serializeModel(review, { reviewer: 'user' }));
});

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res) => {
  const { rating, comment, vehicle } = req.body;
  
  const review = new Review({
    user: req.user._id,
    rating,
    comment,
    vehicle
  });
  
  const createdReview = await review.save();
  await updateVehicleRating(vehicle);
  res.status(201).json(createdReview);
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  
  const review = await Review.findByPk(req.params.id);
  
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  
  // Check if user is the review owner
  if (String(review.user) !== String(req.user._id)) {
    res.status(401);
    throw new Error('Not authorized to update this review');
  }
  
  review.rating = rating || review.rating;
  review.comment = comment || review.comment;
  
  const updatedReview = await review.save();
  await updateVehicleRating(review.vehicle);
  res.json(updatedReview);
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByPk(req.params.id);
  
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  
  // Check if user is the review owner or admin
  if (String(review.user) !== String(req.user._id) && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized to delete this review');
  }
  
  const vehicleId = review.vehicle;
  await review.destroy();
  await updateVehicleRating(vehicleId);
  res.json({ message: 'Review removed' });
});
