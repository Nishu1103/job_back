import { catchASyncError } from "../middlewares/catchASyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import cloudinary from "cloudinary";

export const postApplication = catchASyncError(async (req, res, next) => {
    const { role } = req.user;
    console.log("role:", role);
    if (role === "employer") {

        return next(
            // new ErrorHandler("Employer not allowed to access this resource.", 400)
            res.status(400).json({
                success: false,
                message: "Employer not allowed to access this resource.",
            })
        );
    }
    if (!req.files || Object.keys(req.files).length === 0) {
        // return next(new ErrorHandler("Resume File Required!", 400));

        return res.status(400).json({
            success: false,
            message: "Resume File Required!",
        });
    }

    const { resume } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(resume.mimetype)) {
      return next(
        // new ErrorHandler("Invalid file type. Please upload a PNG file.", 400)
        res.status(400).json({
            success: false,
            message: "Invalid file type. Please upload a PNG file.",
            })
      );
    }
    console.log("resume:", resume);

    if (resume && resume.mimetype) {
        // Access the mimetype property only if 'resume' is defined
        // and has a 'mimetype' property
        const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
        if (!allowedFormats.includes(resume.mimetype)) {
            return next(
                // new ErrorHandler("Invalid file type. Please upload a PNG file.", 400)
                res.status(400).json({
                    success: false,
                    message: "Invalid file type. Please upload a PNG file.",
                })
            );
        }
        // Rest of your code for Cloudinary upload
    } else {
        // Handle the case where 'resume' is undefined
        // return next(new ErrorHandler("Resume file is missing.", 400));
        return res.status(400).json({
            success: false,
            message: "Resume file is missing.",
        });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
            "Cloudinary Error:",
            cloudinaryResponse.error || "Unknown Cloudinary error"
        );
        // return next(new ErrorHandler("Failed to upload Resume to Cloudinary", 500));
        return res.status(500).json({
            success: false,
            message: "Failed to upload Resume to Cloudinary",
        });
    }
    const { name, email, coverLetter, phone, address, jobId } = req.body;

    const applicantID = {
        user: req.user._id,
        role: "jobseeker",
    };
    if (!jobId) {
        console.log("jobId:", jobId);
        // return next(new ErrorHandler("Job not found!", 404));
        return res.status(404).json({
            success: false,
            message: "Job not found!",
        });
    }
    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
        // return next(new ErrorHandler("Job not found!", 404));
        return res.status(404).json({
            success: false,
            message: "Job not found!",
        });
    }

    const employerID = {
        user: jobDetails.postedBy,
        role: "employer",
    };
    if (
        !name ||
        !email ||
        !coverLetter ||
        !phone ||
        !address ||
        !applicantID ||
        !employerID ||
        !resume
    ) {
        // return next(new ErrorHandler("Please fill all fields.", 400));
        return res.status(400).json({
            success: false,
            message: "Please fill all fields.",
        });
    }
    const application = await Application.create({
        name,
        email,
        coverLetter,
        phone,
        address,
        applicantID,
        employerID,
        resume: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });
    res.status(200).json({
        success: true,
        message: "Application Submitted!",
        application,
    });
});

export const employerGetAllApplications = catchASyncError(
    async (req, res, next) => {
        const { role } = req.user;
        if (role === "jobseeker") {
            return next(
                // new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
                res.status(400).json({
                    success: false,
                    message: "Job Seeker not allowed to access this resource.",
                })
            );
        }
        const { _id } = req.user;
        const applications = await Application.find({ "employerID.user": _id });
        res.status(200).json({
            success: true,
            applications,
        });
    }
);

export const jobseekerGetAllApplications = catchASyncError(
    async (req, res, next) => {
        const { role } = req.user;
        if (role === "employer") {
            return next(
                // new ErrorHandler("Employer not allowed to access this resource.", 400)
                res.status(400).json({
                    success: false,
                    message: "Employer not allowed to access this resource.",
                })
            );
        }
        const { _id } = req.user;
        const applications = await Application.find({
            "applicantID.user": _id,
          
        });
        console.log("applications:", applications);
        res.status(200).json({
            success: true,
            applications,
        });
    }
);

export const jobseekerDeleteApplication = catchASyncError(
    async (req, res, next) => {
        const { role } = req.user;
        if (role === "employer") {
            return next(
                // new ErrorHandler("Employer not allowed to access this resource.", 400)
                res.status(400).json({
                    success: false,
                    message: "Employer not allowed to access this resource.",
                })
            );
        }

        const { id } = req.params;
        console.log("id:", id);
        const application = await Application.findById(id);
        console.log("application:", application);
        if (!application) {
            // return next(new ErrorHandler("Application not found!", 404));
            return res.status(404).json({
                success: false,
                message: "Application not found!",
            });
        }

        await application.deleteOne();
        res.status(200).json({
            success: true,
            message: "Application Deleted!",
        });
    }
);
