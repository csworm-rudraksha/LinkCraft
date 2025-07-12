const User = require("../models/user");
const bcrypt = require("bcryptjs");

async function handelUserSignup(req, res) {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.render('signup', { 
                error: "All fields are required",
                name: name || '',
                email: email || ''
            });
        }

        if (password.length < 6) {
            return res.render('signup', { 
                error: "Password must be at least 6 characters long",
                name,
                email
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('signup', { 
                error: "User with this email already exists",
                name,
                email: ''
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Set session
        req.session.userId = user._id;
        req.session.userName = user.name;
        req.session.userEmail = user.email;

        console.log('✅ Signup successful for:', email);
        console.log('Session data:', {
            userId: req.session.userId,
            userName: req.session.userName,
            userEmail: req.session.userEmail
        });

        return res.redirect("/dashboard");
    } catch (error) {
        console.error("Signup error:", error);
        return res.render('signup', { 
            error: "Something went wrong. Please try again.",
            name: req.body.name || '',
            email: req.body.email || ''
        });
    }
} 

async function handelUserLogin(req, res) {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.render('login', { 
                error: "Email and password are required",
                email: email || ''
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { 
                error: "Invalid email or password",
                email: ''
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.render('login', { 
                error: "Invalid email or password",
                email: ''
            });
        }

        // Update last login
        await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

        // Set session
        req.session.userId = user._id;
        req.session.userName = user.name;
        req.session.userEmail = user.email;

        console.log('✅ Login successful for:', email);
        console.log('Session data:', {
            userId: req.session.userId,
            userName: req.session.userName,
            userEmail: req.session.userEmail
        });

        return res.redirect("/dashboard");
    } catch (error) {
        console.error("Login error:", error);
        return res.render('login', { 
            error: "Something went wrong. Please try again.",
            email: req.body.email || ''
        });
    }
}

async function handleUserLogout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout error:", err);
        }
        res.redirect("/");
    });
}

async function requireAuth(req, res, next) {
    console.log('🔐 Auth check - Session userId:', req.session?.userId);
    console.log('🔐 Auth check - Session exists:', !!req.session);
    
    if (!req.session.userId) {
        console.log('❌ Auth failed - No userId in session, redirecting to login');
        return res.redirect("/login");
    }
    console.log('✅ Auth successful - User authenticated');
    next();
}

module.exports = {
    handelUserSignup,
    handelUserLogin,
    handleUserLogout,
    requireAuth
};