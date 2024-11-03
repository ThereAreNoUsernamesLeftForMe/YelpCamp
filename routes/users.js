const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { storeReturnTo } = require('../middleware');
const passport = require('passport') 
const userController = require('../controllers/users')


router.get('/register', userController.registerNewUserForm)

router.post('/register', catchAsync(userController.makeNewUser))

router.get('/login', userController.loginForm)

// use the storeReturnTo middleware to save the Url the user is on before they are redirected to the login page.
router.post('/login', storeReturnTo ,passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}),userController.submitLogin)

router.get('/logout', userController.logUserOut); 

module.exports = router