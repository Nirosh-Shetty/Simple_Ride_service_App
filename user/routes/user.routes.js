import express from "express";
const router = express.Router();
import { signup } from "../controller/user.controller";
router.post("/signup", signup);
// router.post(/signin,);

export default router;
