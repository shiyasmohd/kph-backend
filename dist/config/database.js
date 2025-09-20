"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        const mongoUri = process.env.TRAVEL_MONGODB_URI || 'mongodb://localhost:27017/travel-app';
        await mongoose_1.default.connect(mongoUri);
        console.log(`MongoDB connected: ${mongoose_1.default.connection.host}`);
        mongoose_1.default.connection.on('error', (err) => {
            console.error(`MongoDB connection error: ${err}`);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected. Attempting to reconnect...');
        });
        mongoose_1.default.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });
    }
    catch (error) {
        console.error(`Error connecting to MongoDB: ${error}`);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=database.js.map