import express from "express";
import {
  acceptRide,
  createRide,
  getRidesForUser,
} from "../controller/ride.controller.js";
import { captainAuth, userAuth } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/create-ride", userAuth, createRide);
router.put("/accept-ride", captainAuth, acceptRide);
router.get("/rides", getRidesForUser);

export default router;
