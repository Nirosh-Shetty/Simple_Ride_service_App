import express from "express";
const router = express.Router();
import {
  getCaptain,
  logout,
  signin,
  signup,
  toggleAvailability,
  waitForNewRide,
} from "../controller/captain.controller.js";
import { captainAuth } from "../middleware/auth.middleware.js";

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/get-captain", captainAuth, getCaptain);
router.get("/logout", logout);
router.patch("/toggle-availability", captainAuth, toggleAvailability);
router.get("/wait-for-new-ride", captainAuth, waitForNewRide);

export default router;
