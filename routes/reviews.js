const express = require('express')
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware')
reviewsController = require('../controllers/reviews')


// Routes
router.post('/',isLoggedIn, validateReview, catchAsync(reviewsController.createReview))

router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(reviewsController.deleteReview))

module.exports = router

