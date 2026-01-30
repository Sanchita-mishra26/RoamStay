const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listing.js');

const MongoDB_URL = 'mongodb://127.0.0.1:27017/RoamStay';

async function main() {
    await mongoose.connect(MongoDB_URL);
    console.log("Connected to MongoDB");
    await initDB();
}

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        await Listing.insertMany(initData.data);
        console.log("Data was initialized successfully");
    } catch (err) {
        console.log("Error during initialization:", err);
    }
};

main().catch(err => console.log(err));