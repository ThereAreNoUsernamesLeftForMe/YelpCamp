const User = require('../models/user') 

module.exports.registerNewUserForm = (req,res) => {
    res.render('users/register')
}

module.exports.makeNewUser = async(req,res,next) =>{
    // I think that we will implement this try and catch to catchAsync at somepoint, as it makes no sense to have both. I think colt just did it this way initially to help us see what is happening.
    try{
    const {email, username, password} = req.body
    const user = new User({email, username})
    const registeredUser = await User.register(user,password)
    // If registered user succesfully then automaically sign them in
    req.login(registeredUser, err => {
        if(err) return next(err)
        req.flash('success','Welcome to Yelp Camp!')
        res.redirect('/campgrounds')
    })
    } catch(e){
        req.flash('error',e.message)
        res.redirect('register')
    }
}

module.exports.loginForm = (req,res) => {
    res.render('users/login')
}

module.exports.submitLogin = (req,res) => {
    // If we get into the callback then we know the user  has passed the authentication process set by passport.
    req.flash('success','Welcome back :)')
     // Now we use res.locals.returnTo to redirect the user after login
    resedirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(resedirectUrl)
 }

 module.exports.logUserOut = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}