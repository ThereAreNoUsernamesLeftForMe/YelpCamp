const Campground = require('../models/campground')

module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{ campgrounds}) 
}

module.exports.newCampgroundForm = (req,res) => {
    res.render('campgrounds/new')
}

module.exports.makeNewCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    await campground.save()
    req.flash('success','Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req,res, next) => {
    const campground = await Campground.findById(req.params.id).populate(
        // Nested populate. First we populate the campground with any reviews made for that campground. Then we populate each of these reviews the the user who made that review.
        {path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        // This is populating the author of the campground.
        .populate('author')

    if(!campground){
        req.flash('error','Cannot find that campground.')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}

module.exports.editCampgroundForm = async (req,res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error','Cannot find that campground.')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground})
}

module.exports.editCampground = async (req,res, next) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', `Successfully updated ${campground.title} Campground`)
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params
    const deleting = await Campground.findById(id)
    await Campground.findByIdAndDelete(id)
    req.flash('success', `Successfully deleted the ${deleting.title} Campground`)
    res.redirect('/campgrounds')
}