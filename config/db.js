const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

const ConnectDb = async () => {
    try {
        if (!MONGO_URI) {
            console.log("Mongodb_URI not found");
        }
        await mongoose.connect(MONGO_URI);
        console.log("Mongodb connected successfully");

    } catch (error) {
        console.log(`Db connected error: ${error}`)
    }
}


module.exports = ConnectDb;