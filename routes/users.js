const express = require('express')
const router = express.Router()
const User = require('../models/user') 
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')


router.get('/register', (req,res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async(req,res) =>{
    // I think that we will implement this try and catch to catchAsync at somepoint, as it makes no sense to have both. I think colt just did it this way initially to help us see what is happening.
    try{
    const {email, username, password} = req.body
    const user = new User({email, username})
    const registeredUser = await User.register(user,password)
    // console.log(registeredUser)
    req.flash('success','Welcome to Yelp Camp!')
    res.redirect('/campgrounds')
    } catch(e){
        req.flash('error',e.message)
        res.redirect('register')
    }
}))

router.get('/login', (req,res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}),(req,res) => {
    // If we get into the callback then we know the user has passed the authentication process set by passport.
   req.flash('success','Welcome back :)')
   res.redirect('/campgrounds')
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}); 

module.exports = router