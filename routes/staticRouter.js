const express = require("express");
const router = express.Router();
const { requireAuth } = require("../controllers/user");

// Public routes
router.get("/", (req, res) => {
    if (req.session.userId) {
        return res.redirect("/dashboard");
    }
    return res.render('home', { 
        user: null,
        error: req.query.error || null,
        success: req.query.success || null
    });
});

router.get("/signup", (req, res) => {
    if (req.session.userId) {
        return res.redirect("/dashboard");
    }
    return res.render("signup", { 
        error: null,
        name: '',
        email: ''
    });
});

router.get("/login", (req, res) => {
    if (req.session.userId) {
        return res.redirect("/dashboard");
    }
    return res.render("login", { 
        error: null,
        email: ''
    });
});

// Protected routes
router.get("/dashboard", requireAuth, (req, res) => {
    console.log('🔍 Dashboard accessed by user:', req.session.userName);
    console.log('Session data in dashboard:', {
        userId: req.session.userId,
        userName: req.session.userName,
        userEmail: req.session.userEmail
    });
    
    return res.render('dashboard', { 
        user: {
            name: req.session.userName,
            email: req.session.userEmail
        }
    });
});

module.exports = router;