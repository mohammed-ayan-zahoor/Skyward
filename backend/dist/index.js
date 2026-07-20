"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const installations_1 = __importDefault(require("./routes/installations"));
const leads_1 = __importDefault(require("./routes/leads"));
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use('/api/installations', installations_1.default);
app.use('/api/leads', leads_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/admin', admin_1.default);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Skyward API is running' });
});
// Start server
app.listen(PORT, () => {
    console.log(`[server]: Server is running on port ${PORT}`);
});
