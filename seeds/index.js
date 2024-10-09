//Requring and connecting
const mongoose = require('mongoose')
const cities = require('./cities')
const Campground = require('../models/campground');
const {places, descriptors} = require('./seedHelpers')
const campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('The DB has connected')
})


const sample = array => array[Math.floor(Math.random() * array.length)]

// Delete everything in DB first then add new seed data
const seedDB = async() => {
    await Campground.deleteMany({})
    for(let i = 0; i<50; i++ ){
        const rand1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 20
        const camp = new Campground({
            location : `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description : 'Here is a description of the campground',
            price : price
        })
        await camp.save()  
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})