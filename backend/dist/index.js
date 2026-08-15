"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./db");
const installations_1 = __importDefault(require("./routes/installations"));
const products_1 = __importDefault(require("./routes/products"));
const leads_1 = __importDefault(require("./routes/leads"));
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
// Connect to MongoDB
(0, db_1.connectDB)();
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://skywardkgf.com',
    'https://www.skywardkgf.com',
    'http://72.61.225.80',
    'http://localhost:3000',
    'http://localhost:7005',
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(null, true); // ponytail: permissive fallback for production domain flexibility
        }
    },
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Routes
app.use('/api/installations', installations_1.default);
app.use('/api/products', products_1.default);
app.use('/api/leads', leads_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/admin', admin_1.default);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Skyward API is running with MongoDB' });
});
// Start server
app.listen(PORT, () => {
    console.log(`[server]: Server is running on port ${PORT}`);
});
