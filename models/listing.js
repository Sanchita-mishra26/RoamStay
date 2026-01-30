const mongoose = require('mongoose');   
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    title: {
        type:String,
        required: true,
    },

    description: String,
    image: {
    filename:{
        type: String,
        default: "listingimage",
    }, 
    url:{
    type: String,
    default: "https://unsplash.com/s/photos/beach-house",
    set: (v) => v === "" ? "https://unsplash.com/s/photos/beach-house" : v,
    }
},
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;