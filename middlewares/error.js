class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
// import createToast  from "../utils/tost";
export const errorMiddleware = (err, req, res, next) => {
    console.error("Error Middleware:", err);

    if (err.message.includes("Resource not found")) {
        return res.status(400).json({
            success: false,
            message: `Resource not found. Invalid ${err.path}`,
        });
    }

    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: `Duplicate ${Object.keys(err.keyValue)} Entered`,
        });
    }

    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            success: false,
            message: "Json Web Token is invalid, Try again!",
        });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Json Web Token is expired, Try again!",
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
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
    // createToast(err.message, "error");

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default ErrorHandler;
