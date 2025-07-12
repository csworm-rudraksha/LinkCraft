const mongoose = require('mongoose');

let cachedConnection = null;

async function connectToDB(url) {
    try {
        // If we already have a connection, return it
        if (cachedConnection) {
            return cachedConnection;
        }

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 1, // Reduce for serverless
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        };

        const connection = await mongoose.connect(url, options);
        cachedConnection = connection;
        
        console.log('✅ Connected to MongoDB Atlas successfully');
        return connection;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        throw error;
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    if (cachedConnection) {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    }
});

module.exports = { connectToDB };   