const {campgroundSchema, reviewSchema} = require('./joiSchemas')
const ExpressError = require('./utils/ExpressErrors') 
const Campground = require('./models/campground')
const Review= require('./models/reviews')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Stored the user url they were on before they are redirected to the login page
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in to do this');
        return res.redirect('/login');
    }
    next();
}

// Used to save session.returnTo to locals.returnTo (A property we make). Do this as passport now 
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

// Custom campground input data validator which we made with the help of joi
module.exports.validateCampground = (req,res,next) => { 
    const {error}= campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(element => element.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next()
    }
}

module.exports.isAuthor = async(req,res,next) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash('error',"You don't have permision to do that")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body) 
    if(error){
        const msg = error.details.map(element => element.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next()
    }
    
}

module.exports.isReviewAuthor =  async(req,res,next) => {
    const { campId, reviewId} = req.params
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error',"You don't have permision to do that")
        return res.redirect(`/campgrounds/${campId}`)
    }
    next()
}
