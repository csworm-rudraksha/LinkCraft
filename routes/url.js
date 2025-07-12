const express = require("express");
const router = express.Router();
const { handelGenerateNewShortURL, handelGetAnalytics, handleGetUserUrls, handleDeleteUrl } = require("../controllers/url");
const { requireAuth } = require("../controllers/user");

// Protected routes - require authentication
router.post("/", requireAuth, handelGenerateNewShortURL);
router.get("/analytics/:shortId", requireAuth, handelGetAnalytics);
router.get("/user-urls", requireAuth, handleGetUserUrls);
router.delete("/:shortId", requireAuth, handleDeleteUrl);

module.exports = router;