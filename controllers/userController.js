import { catchASyncError } from "../middlewares/catchASyncError.js";
import ErrorHandler from "../middlewares/error.js";
import User from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchASyncError(async (req, res, err ,next) => {
    const { name, email, phone, role, password } = req.body;

    if (!name || !email || !phone || !role || !password) {
        // return next(new ErrorHandler("Please fill all fields", 400));
        return res.status(400).json({
            success: false,
            message: "Please fill all fields",
        });
    }
    if (err.name === "ValidationError") {
        const errors = {};

        // Extract and organize validation errors
        Object.keys(err.errors).forEach((key) => {
            errors[key] = err.errors[key].message;
        });

        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors,
        });
    }

    const isEmail = await User.findOne({ email });
    if (isEmail) {
        // return next(new ErrorHandler("Email already exists", 400));
        return res.status(400).json({
            success: false,
            message: "Email already exists",
        });
    }
    const user = await User.create({
        name,
        email,
        phone,
        role,
        password,
    });
    sendToken(user, 200, res, "User created successfully");
});

export const login = catchASyncError(async (req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        //  return next(new ErrorHandler("Please fill all fields", 400));
        return res.status(400).json({
            success: false,
            message: "Please fill all fields",
        });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        // return next(new ErrorHandler("Invalid email or password", 401));
        return res.status(401).json({
            success: false,
            message: "User Not Found",
        });
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        // return next(new ErrorHandler("Invalid email or password", 401));
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
    }
    if (user.role !== role) {
        // return next(
        //   new ErrorHandler(`User with provided email and ${role} not found!`, 404)
        // );
        return res.status(404).json({
            success: false,
            message: `User with provided email and ${role} not found!`,
        });
      }
    sendToken(user, 200, res, "Login successfully");
});

export const logout = catchASyncError(async (req, res, next) => {
    res.status(201)
        .cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        })
        .json({
            success: true,
            message: "Logged out successfully",
        });
});

export const getUser = catchASyncError(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});
