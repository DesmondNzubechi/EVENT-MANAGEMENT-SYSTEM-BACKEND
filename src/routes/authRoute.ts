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
  sendVerificationCode,
  updateMe,
  verifyUserEmail,
} from "../controllers/authController";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID of the user
 *         name:
 *           type: string
 *           description: Full name of the user
 *         email:
 *           type: string
 *           description: User's email address
 *         password:
 *           type: string
 *           description: User's password
 *           format: password
 *         role:
 *           type: string
 *           enum: [user, admin, super-admin]
 *           description: Role of the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date the user was created
 */


/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.route("/register").post(registerUser);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *                 format: password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */

router.route("/login").post(loginUser);

/**
 * @swagger
 * /api/v1/auth/fetchMe:
 *   get:
 *     summary: Fetch current user details
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Access forbidden
 */
router.route("/fetchMe").get(fetchMe);
/**
 * @swagger
 * /api/v1/auth/updateMe:
 *   patch:
 *     summary: Update user profile
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       403:
 *         description: Access forbidden
 */

router.route("/updateMe").patch(protectedRoute, updateMe);

/**
 * @swagger
 * /api/v1/auth/changePassword:
 *   patch:
 *     summary: Change user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Current user password
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 description: New user password
 *                 format: password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Invalid credentials
 */

router.route("/changePassword").patch(changeUserPassword);

/**
 * @swagger
 * /api/v1/auth/forgotPassword:
 *   post:
 *     summary: Request a password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
router.route("/forgotPassword").post(forgottPassword);

/**
 * @swagger
 * /api/v1/auth/makeUserAdmin/{id}:
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
 * /api/v1/auth/resetPassword/{token}:
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: New password
 *                 format: password
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm the new password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token or password mismatch
 */
router.route("/resetPassword/:token").patch(resetPassword);


/**
 * @swagger
 * /api/v1/auth/verifyEmail:
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
 * /api/v1/auth/logout:
 *   post:
 *     summary: Log out the user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.route("/logout").post(logoutUser);

/**
 * @swagger
 * //sendVerificationCode:
 *   post:
 *     summary: Send verification code to the user
 *     tags: [Auth]
 *     responses:
 *       201:
 *         description: verification code successfully sent
 */
router.route("/sendVerificationCode").patch(sendVerificationCode);

export default router;
