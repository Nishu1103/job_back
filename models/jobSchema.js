import  Mongoose from "mongoose";

const jobSchema = new Mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter job title"],
        maxLength: [100, "Job title cannot exceed 100 characters"],
    },
    description: {
        type: String,
        required: [true, "Please enter job description"],
        maxLength: [300, "Job description cannot exceed 1000 characters"],
    },
    category: {
        type: String,
        required: [true, "Please enter job category"],
    },
    country: {
        type: String,
        required: [true, "Please enter job country"],
    },
    city: {
        type: String,
        required: [true, "Please enter job city"],
    },
    location: {
        type: String,
        required: [true, "Please enter job location"],
    },
    fixedSalary: {
        type: Number,
         
        minLength: [5, "Job fixed salary must be at least 5 characters long"],
        maxLength: [10, "Job fixed salary cannot exceed 10 characters"],

    },
    salaryFrom: {
        type: Number,
         
        minLength: [5, "Job salary from must be at least 5 characters long"],
        maxLength: [10, "Job salary from cannot exceed 10 characters"],

    },
    salaryTo: {
        type: Number,
         
        minLength: [5, "Job salary to must be at least 5 characters long"],
        maxLength: [10, "Job salary to cannot exceed 10 characters"],

    },
    expired: {
        type: Boolean,
        default: false,
    },
    jobPostedON: {
        type: Date,
        default: Date.now,
    },
    postedBy: {
        type: Mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
});

export const Job = Mongoose.model("Job", jobSchema);
