import dotenv from "dotenv";
import express from "express";
import connect from "./database/mongo.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import doctorRouter from "./routes/doctors.js";
import patientRouter from "./routes/patient.js";
import appointmentRouter from "./routes/appointment.js";
import walletRouter from "./routes/wallet.js";
import financialreportRouter from "./routes/financialreport.js";
import authMiddleware from "./middleware/auth.js"
import validInfo from "./middleware/valid.js";
import errorMiddleware from "./middleware/error.js";

// Express App
const app = express();

// Dotenv
dotenv.config(); // Load environment variables from a .env file into process.env

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// cookie-parser
app.use(cookieParser()); // Parse cookies

// cors
app.use(cors({
    origin: 'http://your-frontend-domain.com', // Allow the frontend domain to access this server
    methods: 'GET,POST,PUT,DELETE',           // Allow these methods
    credentials: true,                       // Allow cookies to be sent
}));

// Routes
app.use('/doctors', authMiddleware, validInfo, doctorRouter); // Doctors route
app.use('/patient', authMiddleware, validInfo, patientRouter); // Patient route
app.use('/appointment', authMiddleware, validInfo, appointmentRouter); // Appointment route
app.use('/wallet', authMiddleware, validInfo, walletRouter); // Wallet route
app.use('/financialreport', authMiddleware, validInfo, financialreportRouter); // Financial report route

// Global error handling middleware
app.use(errorMiddleware);

// Database connection and server start
connect().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((err) => {
    console.error("Database connection failed", err);
    process.exit(1); // Exit process if the connection fails
});
