const express = require('express')
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressErrors')
const Review = require('../models/reviews');
const Campground = require('../models/campground')
const {reviewSchema} = require('../joiSchemas')



// Middleware
const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body) 
    if(error){
        const msg = error.details.map(element => element.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next()
    }
    
}


// Routes
router.post('/',validateReview, catchAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.campId)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success','Successfully posted your review!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', catchAsync(async(req,res) => {
    const { campId, reviewId} = req.params
    // Using pull operator to remove the associated review from our campground document 
    await Campground.findByIdAndUpdate(campId, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','Your review has been deleted')
    res.redirect(`/campgrounds/${campId}`)
}))

module.exports = router

