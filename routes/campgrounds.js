const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')
const campgroundsController = require('../controllers/campgrounds')

// routes
router.get('/', catchAsync(campgroundsController.index))

router.get('/new', isLoggedIn, campgroundsController.newCampgroundForm)

// Protecting this route from people trying to make campgrounds from postman when they are not logged in
router.post('/', isLoggedIn, validateCampground , catchAsync(campgroundsController.makeNewCampground))

router.get('/:id', catchAsync(campgroundsController.showCampground))

router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgroundsController.editCampgroundForm))

router.patch('/:id',isLoggedIn, isAuthor, validateCampground,  catchAsync(campgroundsController.editCampground))

router.delete('/:id',isLoggedIn, isAuthor, catchAsync(campgroundsController.deleteCampground))

// Exporting the ENTIRE router object.
module.exports = router
