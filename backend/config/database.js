import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI

const database = async () => {

    try {
        await mongoose.connect(MONGO_URI);
        console.log("Database connected succssfully");

    } catch (error) {
        console.log("Failed to connect database", error)
    }
}

export default database;