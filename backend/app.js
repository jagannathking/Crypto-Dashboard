import express from 'express';
import cors from 'cors';
import cryptoRoutes from './routes/crypto.routes.js';



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
    });
});


export default app;