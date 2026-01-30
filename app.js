const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require("path");   


const app = express();

const MongoDB_URL = 'mongodb://127.0.0.1:27017/RoamStay';

async function connectDB() {
    console.log("connectDB function loaded");
    await mongoose.connect(MongoDB_URL);
}

connectDB()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });


app.set("view engine", "ejs");
app.set
("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));    

app.get('/', (req, res) => {
    res.send('Hello World!');
});
//get endpoints
// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "my new villa",
//         description: "A nice and cozy apartment located in the heart of the city.",
//         price: 2500,
//         location: "new delhi, delhi",
//         country: "India",
//         image: { url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2..." }
//     });

//     await sampleListing.save();
//     console.log("Sample listing saved");
//     res.send("Sample listing created and saved to the database.");
// });

//index route to list all listings
app.get("/listings", async (req, res) => { 
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

//show route to show details of a particular listing
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);    
    res.render("listings/show.ejs", {listing});
});

app.listen(8080, () => {
    console.log("Server running on port 8080");
});
