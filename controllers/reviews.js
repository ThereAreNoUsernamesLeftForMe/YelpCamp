const Review = require('../models/reviews');
const Campground = require('../models/campground')

module.exports.createReview = async (req,res) => {
    const campground = await Campground.findById(req.params.campId)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success','Successfully posted your review!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async(req,res) => {
    const { campId, reviewId} = req.params
    // Using pull operator to remove the associated review from our campground document 
    await Campground.findByIdAndUpdate(campId, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','Your review has been deleted')
    res.redirect(`/campgrounds/${campId}`)
}