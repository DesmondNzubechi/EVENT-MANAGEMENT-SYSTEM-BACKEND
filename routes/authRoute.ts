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

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/fetchMe").get(protectedRoute, fetchMe);

router.route("/updateMe").patch(updateMe);

router.route("/changePassword").patch(changeUserPassword);

router.route("/forgotPassword").post(forgottPassword);

router.route("/resetPassword/:token").patch(resetPassword);

router.route("/logout").post(logoutUser);

export default router;
