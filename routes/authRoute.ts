import express from "express";
import { loginUser, registerUser } from "../controllers/authController";

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

export default router;
