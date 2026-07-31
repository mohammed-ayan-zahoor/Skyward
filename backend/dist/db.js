"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const mongoURI = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/skyward_db';
    try {
        await mongoose_1.default.connect(mongoURI);
        console.log('[database]: Connected cleanly to MongoDB');
    }
    catch (err) {
        console.error('[database]: MongoDB connection failed:', err);
    }
};
exports.connectDB = connectDB;
