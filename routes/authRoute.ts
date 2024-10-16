import express from "express";
import {
  changeUserPassword,
  fetchMe,
  forgottPassword,
  loginUser,
  logoutUser,
  protectedRoute,
  registerUser,
  resetPassword,
  updateMe,
} from "../controllers/authController";

const router = express.Router();

router.route("auth//register").post(registerUser);

router.route("/auth/login").post(loginUser);

router.route("/auth/fetchMe").get(protectedRoute, fetchMe);

router.route("/auth/updateMe").patch(updateMe);

router.route("/auth/changePassword").patch(changeUserPassword);

router.route("/auth/forgotPassword").post(forgottPassword);

router.route("/auth/resetPassword/:token").patch(resetPassword);

router.route("/auth/logout").post(logoutUser);

export default router;
