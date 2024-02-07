import { catchASyncError } from "../middlewares/catchASyncError.js";
import ErrorHandler from "../middlewares/error.js";

import User from "../models/userSchema.js";
import { Job } from "../models/jobSchema.js";

import { sendToken } from "../utils/jwtToken.js";

export const getAllJObs = catchASyncError(async (req, res, next) => {
    const jobs = await Job.find({ expired: false });
    res.status(200).json({
        success: true,
        jobs,
    });
});

export const postJob = catchASyncError(async (req, res, next) => {
    // const role = req.user.role;
    // const { role } = req.user;
    const { role = req.user?.role } = req.body;

    console.log("req.user:", role, req.user);

    if (role === "jobseeker") {
        // return next(new ErrorHandler("You are not allowed to post a job", 401));
        return res.status(401).json({
            success: false,
            message: "You are not allowed to post a job",
        });
    }
    const {
        title,
        description,
        category,
        fixedSalary,
        salaryFrom,
        salaryTo,

        city,
        country,
        location,
    } = req.body;
    if (!title || !description || !category || !country || !city || !location) {
        // return next(new ErrorHandler("Please fill all fields", 400));
        return res.status(400).json({
            success: false,
            message: "Please fill all fields",
        });
    }
    // if((salaryFrom || salaryTo) && fixedSalary) {
    //     return next(new ErrorHandler("Please select either fixed salary or salary range", 400));
    // }
    // if (salaryFrom && salaryTo && fixedSalary) {
    //     return next(new ErrorHandler("Cannot enter fixed salary and ranged salary", 400));
    // }
    if ((!salaryFrom || !salaryTo) && !fixedSalary) {
        return next(
            // new ErrorHandler(
            //     "Please either provide fixed salary or ranged salary.",
            //     400
            // )
            res.status(400).json({
                success: false,
                message: "Please either provide fixed salary or ranged salary.",
            })
        );
    }

    if (salaryFrom && salaryTo && fixedSalary) {
        return next(
            // new ErrorHandler(
            //     "Cannot Enter Fixed and Ranged Salary together.",
            //     400
            // )
            res.status(400).json({
                success: false,
                message: "Cannot Enter Fixed and Ranged Salary together.",
            })
        );
    }
    const postedBy = req.user.id;
    console.log("postedBy:", postedBy);
    const job = await Job.create({
        title,
        description,
        category,
        fixedSalary,
        salaryFrom,
        salaryTo,
        fixedSalary,
        location,
        country,
        city,
        postedBy,
    });
    res.status(201).json({
        success: true,
        message: "Job posted successfully",
        job,
    });
});

export const getMyJobs = catchASyncError(async (req, res, next) => {
    // const { role } = req.user;
    const { role = req.user?.role } = req.body;
    if (role === "jobseeker") {
        return next(
            // new ErrorHandler(
            //     "Job Seeker not allowed to access this resource.",
            //     400
            // )
            res.status(400).json({
                success: false,
                message: "Job Seeker not allowed to access this resource.",
            })
        );
    }
    const myJobs = await Job.find({ postedBy: req.user._id });
    res.status(200).json({
        success: true,
        myJobs,
    });
});

export const updateJob = catchASyncError(async (req, res, next) => {
    const { role = req.user?.role } = req.body;
    console.log("role:", role);
    if (role === "jobseeker") {
        return next(
            // new ErrorHandler(
            //     "Job Seeker not allowed to access this resource.",
            //     400
            // )
            res.status(400).json({
                success: false,
                message: "Job Seeker not allowed to access this resource.",
            })
        );
    }
    const { id } = req.params;
    // const { id = req.user?.id } = req.body;
    console.log("id:", id);
    let job = await Job.findById(id);
    if (!job) {
        // return next(new ErrorHandler("OOPS! Job not found.", 404));
        return res.status(404).json({
            success: false,
            message: "OOPS! Job not found.",
        });
    }
    job = await Job.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        message: "Job Updated!",
    });
});

export const deleteJob = catchASyncError(async (req, res, next) => {
    const { role = req.user?.role } = req.body;
    console.log("role:", role);
    if (role === "jobseeker") {
        return next(
            // new ErrorHandler(
            //     "Job Seeker not allowed to access this resource.",
            //     400
            // )
            res.status(400).json({
                success: false,
                message: "Job Seeker not allowed to access this resource.",
            })
        );
    }
    const { id } = req.params;
    console.log("id:", id);
    let job = await Job.findById(id);
    if (!job) {
        // return next(new ErrorHandler("OOPS! Job not found.", 404));
        return res.status(404).json({
            success: false,
            message: "OOPS! Job not found.",
        });
    }
    job = await Job.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: "Job Deleted!",
    });
});

export const getSingleJob = catchASyncError(async (req, res, next) => {
    const { id } = req.params;
    console.log("id:", id);
    try {
        const job = await Job.findById(id);
        console.log("job:", job);
        if (!job) {
            // return next(new ErrorHandler("Job not found.", 404));
            return res.status(404).json({
                success: false,
                message: "Job not found.",
            });
        }
        res.status(200).json({
            success: true,
            job,
        });
    } catch (error) {
        console.log("error:", error);
        // return next(new ErrorHandler(`Invalid ID / CastError`, 404));
        return res.status(404).json({
            success: false,
            message: `Invalid ID / CastError`,
        });
    }
});
