import express from "express";
import {
  changeUserPassword,
  fetchMe,
  forgottPassword,
  loginUser,
  logoutUser,
  makeUserAdmin,
  protectedRoute,
  registerUser,
  resetPassword,
  restrictedRoute,
  updateMe,
  verifyUserEmail,
} from "../controllers/authController";

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/fetchMe").get(fetchMe);

router.route("/updateMe").patch(protectedRoute, updateMe);

router.route("/changePassword").patch(changeUserPassword);

router.route("/forgotPassword").post(forgottPassword);

router.route("/makeUserAdmin/:id").patch(protectedRoute, restrictedRoute(["super-admin"]), makeUserAdmin);

router.route("/resetPassword/:token").patch(resetPassword);

router.route("/verifyEmail").patch(verifyUserEmail);

router.route("/logout").post(logoutUser);

export default router; 
