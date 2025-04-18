import app from './app.js';
import dotenv from 'dotenv';
import connectDatabase from './config/database.js';

dotenv.config();

// Connect to Database
connectDatabase(); 

// PORT configuration
const PORT = process.env.PORT || 5001; 

// Start the Server
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
