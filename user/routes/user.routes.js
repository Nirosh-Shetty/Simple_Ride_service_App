import express from "express";
const router = express.Router();
import {
  getUser,
  isRideAccepted,
  logout,
  signin,
  signup,
  getRideHistory,
} from "../controller/user.controller.js";
import { userAuth } from "../middleware/auth.middleware.js";
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/get-user", userAuth, getUser);
router.get("/logout", logout);

router.get("/is-ride-accepted", userAuth, isRideAccepted);
router.get("/ride-history", userAuth, getRideHistory);
export default router;
