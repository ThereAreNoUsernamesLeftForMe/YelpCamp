//Requring and connecting
const express = require('express')
const app = express()   
const path = require('path')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const ExpressError = require('./utils/ExpressErrors')


// connecting routers 
const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('The DB has connected')
})


// Setting up ejs
app.set('view engine','ejs')
// Setting the absolute path to the 'views' directory, so regardless where I start my server from, express will be able to find 'views' and serve it as intended
app.set('views', path.join(__dirname,'views'))

// Telling express to parse the body of requests (So req.body)
app.use(express.urlencoded({ extended: true }));

// Telling express to allow forms to submit PATCH, DELETE and PUT requests
app.use(methodOverride('_method'))

// Telling express that we want whatever is in the 'public' directory to be able to be served to the clients browser
app.use(express.static('public'))



// Telling express to use ejsMate as the engine we want to use to run ejs, insteasd of the default one in express
app.engine('ejs', ejsMate)



// Routes
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:campId/reviews', reviews)

app.get('/', (req,res) => {
    res.render('home')
})


// .all hits every path user types int to the url. This is why it is at the end off all route handelers and above the custom error handeler we made. If a user enters a route that doesn't exist, then the req will bypass all our above route handelers and then hit this one. Then we throw a custom error and pass that to our error handeler to send 'page not found' and a 404 status, instead of the default values we defined in the error handeler.

app.all('*', (req,res,next) =>{
     // We are defining the error we want to be thrown via the error handeler when .all is hit. We are not throwing the error right as .all is hit though. What happens is that when .all is hit, we use then next middleware in express to call the error handeler with the error we define in it. 
 
    next( new ExpressError('Page not found', 404))
    
     // We can just throw the error here as well, and it will work fine. A reason we don't is that via sending to an error handeler our console stays a bit cleaner and I think it is standard practice to try and route all errors through you handlers if possible, as this is the reason we have included them in our code.

    // throw new ExpressError('Page not found', 404)
})

// Custom error handeler
app.use((err,req,res,next) => {
    const {statusCode = 500 , message = 'Something went wrong. Our team of highly trained monkeys are working on it as you read this.', stack} = err
    res.status(statusCode).render('error', { statusCode, message, stack })
})


app.listen(3000, () => {
    console.log('Listening on port 3000')
})


// With next(err) exress can handle both syncornous and async errors. If you don't use next(err) then express can only handle synconous errors.

// next(), so with no argument will call the next middlware in your code. With an argumanet passed will call the next error handeler in your code, if you do not have a custom handeler defined express will use the default error haneler built in with JS.


