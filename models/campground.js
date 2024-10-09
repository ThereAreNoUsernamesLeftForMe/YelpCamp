const mongoose = require('mongoose')
const schema = mongoose.Schema

const CampgroundsSchema = new schema ({
    title : String,
    price : Number,
    image : String,
    description : String,
    location : String,
    reviews: [
        {
            type: schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

module.exports = mongoose.model('Campground', CampgroundsSchema)