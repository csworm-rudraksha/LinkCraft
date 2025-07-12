const mongoose = require('mongoose');

async function connectToDB(url) {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        };

        await mongoose.connect(url, options);
        console.log('✅ Connected to MongoDB Atlas successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
}

module.exports = { connectToDB };   