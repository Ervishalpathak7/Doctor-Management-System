// Import necessary modules
import dotenv from "dotenv";
import express from "express";
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import cors from "cors";
import winston from 'winston';
import expressWinston from 'express-winston';

// Routers
import doctorRouter from "./routes/doctors.js";
import patientRouter from "./routes/patient.js";
import appointmentRouter from "./routes/appointment.js";
import walletRouter from "./routes/wallet.js";
import financialreportRouter from "./routes/financialreport.js";

// Middleware
import authMiddleware from "./middleware/auth.js";
import validInfo from "./middleware/valid.js";
import errorMiddleware from "./middleware/error.js";
import connect from "./database/mongo.js";

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Request logging using winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/app.log' })
    ]
});

app.use(expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    expressFormat: true,
    colorize: false
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX || 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '5mb' })); // Reduced limit to 5MB
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie'],
    credentials: true,
    maxAge: 86400
};
app.use(cors(corsOptions));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'up',
        timestamp: new Date(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});

// API routes
app.use('/api/doctors', authMiddleware, validInfo, doctorRouter);
app.use('/api/patients', authMiddleware, validInfo, patientRouter);
app.use('/api/appointments', authMiddleware, validInfo, appointmentRouter);
app.use('/api/wallets', authMiddleware, validInfo, walletRouter);
app.use('/api/reports', authMiddleware, validInfo, financialreportRouter);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Not Found',
        message: `The requested URL ${req.originalUrl} was not found on this server.`
    });
});

// Error handling middleware
app.use(errorMiddleware);

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    logger.info(`${signal} signal received: closing HTTP server`);
    try {
        await mongoose.connection.close();
        server.close(() => {
            logger.info('HTTP server closed');
            process.exit(0);
        });
    } catch (err) {
        logger.error('Error during shutdown:', err);
        process.exit(1);
    }
};

// Error handlers for uncaught errors
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});

// Shutdown signal handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const PORT = process.env.PORT || 3000;
let server;

connect()
    .then(() => {
        server = app.listen(PORT, () => {
            logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    })
    .catch((err) => {
        logger.error("Database connection failed:", err);
        process.exit(1);
    });

// Export app for testing
export default app;
 
    