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
    const campground = await Campground.findById(req.params.campid)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', catchAsync(async(req,res) => {
    console.log(`This is from line 35 + 36 of routes/reviews.js:`)
    console.log(req.params)
    const { campId, reviewId} = req.params
    console.log(`This is from line 38 + 39 of routes/reviews.js. I am loging campid:`)
    console.log(campId)
    // Using pull operator to remove the associated review from our campground document 
    await Campground.findByIdAndUpdate(campId, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${campId}`)
}))

module.exports = router

// yeej