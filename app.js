const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require("path");   
const { title } = require('process');
const { privateDecrypt } = require('crypto');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); 
const app = express();
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");    

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));   
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/Public")));

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
app.get("/listings", wrapAsync(async (req, res) => { 
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));
//new route 
app.get("/listings/new", (req,res) =>{
    res.render("listings/new.ejs")

})

//show route to show details of a particular listing
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);    
    res.render("listings/show.ejs", {listing});
}));

//create route
app.post("/listings", wrapAsync(async(req,res,next) =>{
    if(!req.body.listing){
        throw new ExpressError(400, "Invalid listing data");
    }
    const newListing = new Listing(req.body.listing);
    if(!newListing.description){
        throw new ExpressError(400, "Description is required");
    }
    if(!newListing.title){
        throw new ExpressError(400, "Title is required");
    }
    if(!newListing.price){
        throw new ExpressError(400, "Price is required");
    }
    if(!newListing.location){
        throw new ExpressError(400, "Location is required");
    }
    if(!newListing.country){
        throw new ExpressError(400, "Country is required");
    }
    await newListing.save();
    res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs", { listing });
    }));

//update route
app.put("/listings/:id", wrapAsync(async(req, res) => {
    let { id } = req.params;
   await Listing.findByIdAndUpdate(id , {...req.body.listing});
   res.redirect("/listings");
}));

//delete this route
app.delete("/listings/:id" , wrapAsync(async (req,res) =>{
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}));

//if no route matches, this will be executed
app.use((req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

//middleware to handle errors   
app.use((err,req, res, next) => { 
   let { statusCode = 500, message = "Something went wrong" } = err;
   res.status(statusCode).send(message);
});



app.listen(8080, () => {
    console.log("Server running on port 8080");
});
