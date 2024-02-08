import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env "});

const dbConnection = async () => {
    try {
        await mongoose.connect( process.env.MONGO_URL, {
            dbName: "MERN_STACK_JOB_SEEKING",
            
        });
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
    }

};
export default dbConnection;
 
