const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
    try {
        const dbURI = process.env.MONGODB_URI;
        if (!dbURI) {
            throw new Error("MongoDB URI is not defined in .env file");
        }

        // Connect to MongoDB
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
  //          serverSelectionTimeoutMS: 5000,  // Adjust this as needed
//            socketTimeoutMS: 45000,          // Adjust this as needed
        });
        
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit the process if connection fails
    }
};

module.exports = connectDB;
