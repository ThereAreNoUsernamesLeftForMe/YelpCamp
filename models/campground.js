const mongoose = require('mongoose')
const review = require('./reviews')
const schema = mongoose.Schema

const CampgroundsSchema = new schema ({
    title : String,
    price : Number,
    image : String,
    description : String,
    location : String,
    author: {
        type: schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

// Delete middleware
// .post lets you pass in the document(s) that were edidted/deleted into the callback you pass through as the second argument of .post
CampgroundsSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundsSchema)