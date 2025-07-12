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

        console.log('🔌 Attempting to connect to MongoDB...');
        const connection = await mongoose.connect(url, options);
        cachedConnection = connection;
        
        console.log('✅ Connected to MongoDB Atlas successfully');
        
        // Test the connection
        const adminDb = connection.connection.db.admin();
        const result = await adminDb.ping();
        console.log('🏓 MongoDB ping result:', result);
        
        return connection;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.error('❌ Full error:', error);
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