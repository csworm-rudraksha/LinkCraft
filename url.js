const { nanoid } = require("nanoid");
const URL = require("../models/url");
const User = require("../models/user");

async function handelGenerateNewShortURL(req, res) {
    try {
        const { url, title, expiresAt } = req.body;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ error: "Authentication required" });
        }

        if (!url) {
            return res.status(400).json({
                error: "URL is required",
            });
        }

        // Validate URL format
        const urlRegex = /^https?:\/\/.+/;
        if (!urlRegex.test(url)) {
            return res.status(400).json({
                error: "Please enter a valid URL starting with http:// or https://",
            });
        }

        // Generate unique shortId
        let shortId;
        let isUnique = false;
        while (!isUnique) {
            shortId = nanoid(8);
            const existingUrl = await URL.findOne({ shortId });
            if (!existingUrl) {
                isUnique = true;
            }
        }

        // Create URL
        const newUrl = await URL.create({
            shortId,
            redirectURL: url,
            title: title || 'Untitled URL',
            createdBy: userId,
            visitHistory: [],
            expiresAt: expiresAt ? new Date(expiresAt) : null
        });

        // Update user's URL count
        await User.findByIdAndUpdate(userId, { $inc: { urlCount: 1 } });

        // Use production URL for short URL generation
        const baseUrl = process.env.NODE_ENV === 'production' 
            ? 'https://linkcraft-cuh7.onrender.com/' 
            : `${req.protocol}://${req.get('host')}`;

        return res.json({ 
            success: true,
            shortId,
            shortUrl: `${baseUrl}/url/${shortId}`,
            title: newUrl.title,
            originalUrl: url
        });
    } catch (error) {
        console.error("URL generation error:", error);
        return res.status(500).json({
            error: "Failed to generate short URL. Please try again.",
        });
    }
}

async function handelGetAnalytics(req, res) {
    try {
        const { shortId } = req.params;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const result = await URL.findOne({ 
            shortId, 
            createdBy: userId,
            isActive: true 
        });

        if (!result) {
            return res.status(404).json({ error: "URL not found" });
        }

        // Check if URL has expired
        if (result.expiresAt && new Date() > result.expiresAt) {
            return res.status(410).json({ error: "URL has expired" });
        }

        // Calculate analytics
        const totalClicks = result.visitHistory.length;
        const uniqueVisitors = new Set(result.visitHistory.map(visit => visit.ip)).size;
        
        // Get recent visits (last 7 days)
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const recentVisits = result.visitHistory.filter(visit => visit.timestamp > sevenDaysAgo);

        return res.json({
            shortId: result.shortId,
            title: result.title,
            redirectURL: result.redirectURL,
            totalClicks,
            uniqueVisitors,
            recentVisits: recentVisits.length,
            analytics: result.visitHistory,
            createdAt: result.createdAt,
            expiresAt: result.expiresAt,
            isActive: result.isActive
        });
    } catch (error) {
        console.error("Analytics error:", error);
        return res.status(500).json({ error: "Failed to fetch analytics" });
    }
}

async function handleGetUserUrls(req, res) {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const urls = await URL.find({ 
            createdBy: userId,
            isActive: true 
        }).sort({ createdAt: -1 });

        // Use production URL for short URL generation
        const baseUrl = process.env.NODE_ENV === 'production' 
            ? 'https://linkcraft-cuh7.onrender.com/' 
            : `${req.protocol}://${req.get('host')}`;

        const urlsWithAnalytics = urls.map(url => ({
            shortId: url.shortId,
            title: url.title,
            redirectURL: url.redirectURL,
            totalClicks: url.visitHistory.length,
            createdAt: url.createdAt,
            expiresAt: url.expiresAt,
            shortUrl: `${baseUrl}/url/${url.shortId}`
        }));

        return res.json({ urls: urlsWithAnalytics });
    } catch (error) {
        console.error("Get user URLs error:", error);
        return res.status(500).json({ error: "Failed to fetch URLs" });
    }
}

async function handleDeleteUrl(req, res) {
    try {
        const { shortId } = req.params;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const url = await URL.findOneAndDelete({ 
            shortId, 
            createdBy: userId 
        });

        if (!url) {
            return res.status(404).json({ error: "URL not found" });
        }

        // Update user's URL count
        await User.findByIdAndUpdate(userId, { $inc: { urlCount: -1 } });

        return res.json({ success: true, message: "URL deleted successfully" });
    } catch (error) {
        console.error("Delete URL error:", error);
        return res.status(500).json({ error: "Failed to delete URL" });
    }
}

module.exports = { 
    handelGenerateNewShortURL,
    handelGetAnalytics,
    handleGetUserUrls,
    handleDeleteUrl
};
