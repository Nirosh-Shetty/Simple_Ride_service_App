import express from "express";
const router = express.Router();
import {
  getUser,
  logout,
  signin,
  signup,
} from "../controller/user.controller.js";
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/getuser", getUser);
router.get("/logout", logout);
export default router;
