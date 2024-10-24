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
  verifyUserEmail,
} from "../controllers/authController";
import { buyEventTicket } from "../controllers/paymentController";

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/fetchMe").get(fetchMe);

router.route("/updateMe").patch(protectedRoute, updateMe);

router.route("/changePassword").patch(changeUserPassword);

router.route("/forgotPassword").post(forgottPassword);

router.route("/resetPassword/:token").patch(resetPassword);

router.route("/verifyEmail").patch(verifyUserEmail);

router.route("/pay").get(buyEventTicket);

router.route("/logout").post(logoutUser);
 
export default router;
