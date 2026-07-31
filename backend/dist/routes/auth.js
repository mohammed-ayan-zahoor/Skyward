"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'replace-with-a-secure-random-secret-key';
// POST /api/auth/login
// Public route to authenticate admin users
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }
    try {
        // Find user in db
        const user = await User_1.User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        // Verify password hash
        const isPasswordValid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        const userId = user._id.toString();
        // Create JWT
        const token = jsonwebtoken_1.default.sign({ userId, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevents JavaScript XSS access
            secure: process.env.NODE_ENV === 'production', // https only in prod
            sameSite: 'lax', // standard CSRF protection
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.json({
            message: 'Login successful',
            user: {
                id: userId,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error during login' });
    }
});
// POST /api/auth/logout
// Public route to clear the auth session cookie
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    res.json({ message: 'Logged out successfully' });
});
// GET /api/auth/me
// Protected route to check the current session state
router.get('/me', auth_1.requireAuth, (req, res) => {
    res.json({ user: req.user });
});
exports.default = router;
