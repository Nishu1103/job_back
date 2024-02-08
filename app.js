import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import useRouter from "./routes/userRouter.js";
import applicationRouterr from "./routes/applicationRouter.js";
import jobRouter from "./routes/jobRouter.js";
import dbConnection from "./database/dbconnection.js";
import ErrorHandler from './middlewares/error.js';
import errorMiddleware from './middlewares/error.js';
const PORT = process.env.PORT || 4000;
const app = express();
dotenv.config({ path: "./config/config.env "});


app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    method: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
console.log(process.env.FRONTEND_URL);

app.options('*', cors());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir:"/tmp/",
}));

app.use("/api/v1/user", useRouter);
app.use("/api/v1/application", applicationRouterr);
app.use("/api/v1/job", jobRouter);


dbConnection();
app.use(ErrorHandler);
app.use(errorMiddleware);

 //Connect to the database before listening
// dbConnection().then(() => {
//     app.listen(PORT, () => {
//         console.log("listening for requests");
//     })
// })


export default app;
