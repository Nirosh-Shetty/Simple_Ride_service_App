import express from "express";
const router = express.Router();
import {
  getUser,
  logout,
  signin,
  signup,
} from "../controller/user.controller.js";
import { userAuth } from "../middleware/auth.middleware.js";
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/get-user", userAuth, getUser);
router.get("/logout", logout);
export default router;
