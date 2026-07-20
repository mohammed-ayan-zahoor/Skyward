"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const requireAuth = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        res.status(401).json({ error: 'Access denied: No token provided' });
        return;
    }
    try {
        const secret = process.env.JWT_SECRET || 'replace-with-a-secure-random-secret-key';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Access denied: Invalid or expired token' });
    }
};
exports.requireAuth = requireAuth;
const requireAdmin = (req, res, next) => {
    (0, exports.requireAuth)(req, res, () => {
        if (req.user?.role !== 'admin') {
            res.status(403).json({ error: 'Access denied: Admin privileges required' });
            return;
        }
        next();
    });
};
exports.requireAdmin = requireAdmin;
