import express from 'express';
// import getAllJObs  from '../controllers/jobController.js';
const router = express.Router();
import { isAuthorized } from "../middlewares/auth.js";
import { getAllJObs, postJob , getMyJobs, updateJob,deleteJob, getSingleJob } from "../controllers/jobController.js";

router.get("/getall",getAllJObs);
router.post("/post", isAuthorized,postJob);
router.get("/getmyjobs", isAuthorized,getMyJobs);
router.put("/update/:id", isAuthorized,updateJob);
router.delete("/delete/:id", isAuthorized,deleteJob);
router.get("/:id", isAuthorized, getSingleJob);
export default router;
