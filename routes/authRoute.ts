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
router.route("/register").post(registerUser);

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
router.route("/login").post(loginUser);

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
router.route("/fetchMe").get(fetchMe);

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
router.route("/updateMe").patch(protectedRoute, updateMe);

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
router.route("/changePassword").patch(changeUserPassword);

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
router.route("/forgotPassword").post(forgottPassword);

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
  .patch(protectedRoute, restrictedRoute(["super-admin"]), makeUserAdmin);

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
router.route("/resetPassword/:token").patch(resetPassword);

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
router.route("/verifyEmail").patch(verifyUserEmail);

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
router.route("/logout").post(logoutUser);

export default router;
