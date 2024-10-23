const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressErrors')
const Campground = require('../models/campground')
const {campgroundSchema} = require('../joiSchemas')
const {isLoggedIn} = require('../middleware')
    

// Custom campground input data validator which we made with the help of joi
const validateCampground = (req,res,next) => { 
    const {error}= campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(element => element.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next()
    }
}

// routes
router.get('/', catchAsync(async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{ campgrounds}) 
}))

router.get('/new', isLoggedIn, (req,res) => {
    res.render('campgrounds/new')
})

// Protecting this route from people trying to make campgrounds from postman when they are not logged in
router.post('/', isLoggedIn, validateCampground , catchAsync(async (req, res, next) => {

    const campground = new Campground(req.body.campground)
    await campground.save()
    req.flash('success','Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async (req,res, next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews')
    if(!campground){
        req.flash('error','Cannot find that campground.')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}))

router.get('/:id/edit',isLoggedIn, catchAsync(async (req,res, next) => {
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error','Cannot find that campground.')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground})
}))


router.patch('/:id',isLoggedIn, validateCampground,  catchAsync(async (req,res, next) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success', `Successfully updated ${campground.title} Campground`)
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id',isLoggedIn,  catchAsync(async (req, res, next) => {
    const { id } = req.params
    const deleting = await Campground.findById(id)
    console.log()
    await Campground.findByIdAndDelete(id)
    req.flash('success', `Successfully deleted the ${deleting.title} Campground`)
    res.redirect('/campgrounds')
}))


module.exports = router
