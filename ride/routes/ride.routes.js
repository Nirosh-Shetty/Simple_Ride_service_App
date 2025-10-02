import express from "express";
import { createRide } from "../controller/ride.controller";
import { userAuth } from "../middleware/auth.middleware";
const router = express.Router();

router.post("create-ride", userAuth, createRide);

export default router;
