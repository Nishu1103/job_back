import mongoose from "mongoose";
import dotenv from "dotenv";

const dbConnection = async () => {
    try {
        await mongoose.connect( "mongodb+srv://itsboiii:ZrJa1SeC7hFD3NHM@job.lohqtdu.mongodb.net/", {
            dbName: "MERN_STACK_JOB_SEEKING",
            
        });
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
    }

};
export default dbConnection;
 
