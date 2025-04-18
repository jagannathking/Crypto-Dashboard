import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cryptoRoutes from './routes/crypto.routes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// API Routes

app.use("/api/crypto", cryptoRoutes); 

//  Test Route
app.get("/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend is healthy",
        timestamp: new Date().toISOString()
    });
});


export default app;