"use strict";
// import express from "express";
// import { protectedRoute, restrictedRoute } from "../controllers/authController";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import {
//   createAUser,
//   deleteAUser,
//   getAllUser,
//   getAUser,
//   updateUser,
// } from "../controllers/userController";
// const router = express.Router();
// router
//   .route("/createUser")
//   .post(protectedRoute, restrictedRoute(["admin"]), createAUser);
// router
//   .route("/getAUser")
//   .get(protectedRoute, restrictedRoute(["admin"]), getAUser);
// router
//   .route("/getAllUser")
//   .get(protectedRoute, restrictedRoute(["admin"]), getAllUser);
// router
//   .route("/deleteAUser")
//   .patch(protectedRoute, restrictedRoute(["admin"]), deleteAUser);
// router
//   .route("/updateAUser")
//   .patch(protectedRoute, restrictedRoute(["admin"]), updateUser);
// export default router;
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
/**
 * @swagger
 * /api/v1/user/createUser:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input or validation error
 */
router
    .route("/createUser")
    .post(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), userController_1.createAUser);
/**
 * @swagger
 * /api/v1/user/getAUser:
 *   get:
 *     summary: Get a specific user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *       404:
 *         description: User not found
 */
router
    .route("/getAUser")
    .get(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), userController_1.getAUser);
/**
 * @swagger
 * /api/v1/user/getAllUser:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router
    .route("/getAllUser")
    .get(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), userController_1.getAllUser);
/**
 * @swagger
 * /api/v1/user/deleteAUser:
 *   patch:
 *     summary: Delete a user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: User ID
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router
    .route("/deleteAUser")
    .patch(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), userController_1.deleteAUser);
/**
 * @swagger
 * /api/v1/user/updateAUser:
 *   patch:
 *     summary: Update a user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *       400:
 *         description: Validation error
 */
router
    .route("/updateAUser")
    .patch(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), userController_1.updateUser);
exports.default = router;
