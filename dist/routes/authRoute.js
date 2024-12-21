"use strict";
// import express from "express";
// import {
//   changeUserPassword,
//   fetchMe,
//   forgottPassword,
//   loginUser,
//   logoutUser,
//   makeUserAdmin,
//   protectedRoute,
//   registerUser,
//   resetPassword,
//   restrictedRoute,
//   updateMe,
//   verifyUserEmail,
// } from "../controllers/authController";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// router.route("/register").post(registerUser);
// router.route("/login").post(loginUser);
// router.route("/fetchMe").get(fetchMe);
// router.route("/updateMe").patch(protectedRoute, updateMe);
// router.route("/changePassword").patch(changeUserPassword);
// router.route("/forgotPassword").post(forgottPassword);
// router.route("/makeUserAdmin/:id").patch(protectedRoute, restrictedRoute(["super-admin"]), makeUserAdmin);
// router.route("/resetPassword/:token").patch(resetPassword);
// router.route("/verifyEmail").patch(verifyUserEmail);
// router.route("/logout").post(logoutUser);
// export default router;
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.route("/register").post(authController_1.registerUser);
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */
router.route("/login").post(authController_1.loginUser);
/**
 * @swagger
 * /fetchMe:
 *   get:
 *     summary: Fetch current user details
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *       403:
 *         description: Access forbidden
 */
router.route("/fetchMe").get(authController_1.fetchMe);
/**
 * @swagger
 * /updateMe:
 *   patch:
 *     summary: Update user profile
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       403:
 *         description: Access forbidden
 */
router.route("/updateMe").patch(authController_1.protectedRoute, authController_1.updateMe);
/**
 * @swagger
 * /changePassword:
 *   patch:
 *     summary: Change user password
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Unauthorized
 */
router.route("/changePassword").patch(authController_1.changeUserPassword);
/**
 * @swagger
 * /forgotPassword:
 *   post:
 *     summary: Request a password reset
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
router.route("/forgotPassword").post(authController_1.forgottPassword);
/**
 * @swagger
 * /makeUserAdmin/{id}:
 *   patch:
 *     summary: Grant admin role to a user
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: User ID
 *     responses:
 *       200:
 *         description: User granted admin role successfully
 *       403:
 *         description: Access forbidden
 */
router
    .route("/makeUserAdmin/:id")
    .patch(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["super-admin"]), authController_1.makeUserAdmin);
/**
 * @swagger
 * /resetPassword/{token}:
 *   patch:
 *     summary: Reset password with token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           description: Password reset token
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token or expired
 */
router.route("/resetPassword/:token").patch(authController_1.resetPassword);
/**
 * @swagger
 * /verifyEmail:
 *   patch:
 *     summary: Verify user email
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Verification failed
 */
router.route("/verifyEmail").patch(authController_1.verifyUserEmail);
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Log out the user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.route("/logout").post(authController_1.logoutUser);
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Log out the user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.route("/sendVerificationCode").patch(authController_1.sendVerificationCode);
exports.default = router;
