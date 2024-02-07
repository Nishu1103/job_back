import Mongoose  from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";  
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });


const userSchema = new Mongoose.Schema({ 
    name: {
        type: String,
        required: [true, "Please enter your name"],
      //  maxLength: [30, "Your name cannot exceed 30 characters"],
      //  minLength: [4, "Your name must be at least 4 characters long"], 

    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
       // validate: [validator.isEmail, "Please enter valid email address"],
    },
    phone: {
        type: String,
        required: [true, "Please enter your phone number"],

    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
     //   minLength: [8, "Your password must be longer than 6 characters"],
        select: false,
    },
    // confirmPassword: {
    //     type: String,
    //     required: [true, "Please confirm your password"],
    //     // validate: {
    //     //     validator: function (el) {
    //     //         return el === this.password;
    //     //     },
    //     //     message: "Passwords are not the same",
    //     // },
    // },
    role: {
        type: String,
        default: "user",
        required: [true, "Please enter your role"],
        enum:["jobseeker", "employer"],

    },
    createdAt: {
        type: Date,
        default: Date.now,
    },


});

// Encrypting password before saving user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = undefined;
    next();
});

// compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Return JWT token     
userSchema.methods.getJwtToken = function () {
    console.log("JWT_SECRET:", process.env.JWT_SECRET_KEY);
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRY,

    });
};

export default Mongoose.model("User", userSchema);
 