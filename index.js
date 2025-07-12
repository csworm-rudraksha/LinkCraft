require('dotenv').config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { connectToDB } = require("./connect");
const URL = require("./models/url");

// Importing routes
const staticRoute = require("./routes/staticRouter");
const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 8001;

// MongoDB Atlas connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/short-url";

// Connect to MongoDB Atlas (handle errors gracefully)
connectToDB(MONGODB_URI).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGODB_URI,
        collectionName: 'sessions',
        ttl: 24 * 60 * 60, // 24 hours
        autoRemove: 'native'
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        httpOnly: true
    }
}));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Make user data available to all views
app.use((req, res, next) => {
    res.locals.user = req.session.userId ? {
        id: req.session.userId,
        name: req.session.userName,
        email: req.session.userEmail
    } : null;
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Routes
app.use("/url", urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);

// URL redirection with enhanced analytics
app.get('/url/:shortId', async (req, res) => {
    try {
        const shortId = req.params.shortId;

        const entry = await URL.findOne({ 
            shortId,
            isActive: true 
        });

        if (!entry) {
            return res.status(404).render('error', { 
                error: "Short URL not found",
                message: "The requested short URL does not exist or has been deactivated."
            });
        }

        // Check if URL has expired
        if (entry.expiresAt && new Date() > entry.expiresAt) {
            return res.status(410).render('error', { 
                error: "URL Expired",
                message: "This short URL has expired and is no longer available."
            });
        }

        // Record visit with enhanced data
        const visitData = {
            timestamp: Date.now(),
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent') || 'Unknown'
        };

        await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: visitData,
                },
            }
        );

        res.redirect(entry.redirectURL);
    } catch (error) {
        console.error("URL redirection error:", error);
        res.status(500).render('error', { 
            error: "Server Error",
            message: "An error occurred while processing your request."
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).render('error', { 
        error: "Server Error",
        message: "Something went wrong on our end. Please try again later."
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', { 
        error: "Page Not Found",
        message: "The page you're looking for doesn't exist."
    });
});

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 LinkCraft Server Started at PORT: ${PORT}`);
        console.log(`📱 Visit: ${process.env.NODE_ENV === 'production' ? 'https://linkcraft-cuh7.onrender.com/' : `http://localhost:${PORT}`}`);
        console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

// Export for Vercel
module.exports = app;
