const mongoose = require('mongoose')
const schema = mongoose.Schema

const reviewSchema = new schema({
    body: String,
    rating:{ 
        type: Number,
        }
})    

module.exports = mongoose.model('Review', reviewSchema)

// Testing git branch 