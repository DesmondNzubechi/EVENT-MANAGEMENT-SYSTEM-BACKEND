"use strict";
// import express from "express";
// import { protectedRoute, restrictedRoute } from "../controllers/authController";
// import {
//   confirmBooking,
//   createEventBooking,
//   getAllTheEventBooked,
//   getAUserEventBookings,
// } from "../controllers/bookingController";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// router.route("/bookEvent/:eventId").post(protectedRoute, createEventBooking);
// router
//   .route("/bookEvent/confirmPayment/:bookingId")
//   .get(protectedRoute, confirmBooking);
// router
//   .route("/getAllTheEventBookings")
//   .get(protectedRoute, restrictedRoute(["admin"]), getAllTheEventBooked);
// router.route("/getUserBookedEvent").get(protectedRoute, getAUserEventBookings);
// export default router;
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const bookingController_1 = require("../controllers/bookingController");
const router = express_1.default.Router();
/**
 * @swagger
 * /bookEvent/{eventId}:
 *   post:
 *     summary: Book an event
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *           description: ID of the event to book
 *     responses:
 *       201:
 *         description: Event booked successfully
 *       403:
 *         description: Access forbidden
 */
router.route("/bookEvent/:eventId").post(authController_1.protectedRoute, bookingController_1.createEventBooking);
/**
 * @swagger
 * /bookEvent/confirmPayment/{bookingId}:
 *   get:
 *     summary: Confirm payment for an event booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *           description: Booking ID to confirm payment
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 *       403:
 *         description: Access forbidden
 */
router
    .route("/bookEvent/confirmPayment/:bookingId")
    .get(authController_1.protectedRoute, bookingController_1.confirmBooking);
/**
 * @swagger
 * /getAllTheEventBookings:
 *   get:
 *     summary: Get all event bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: List of all event bookings
 *       403:
 *         description: Access forbidden
 */
router
    .route("/getAllTheEventBookings")
    .get(authController_1.protectedRoute, (0, authController_1.restrictedRoute)(["admin"]), bookingController_1.getAllTheEventBooked);
/**
 * @swagger
 * /getUserBookedEvent:
 *   get:
 *     summary: Get a user's event bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: List of user's booked events
 *       403:
 *         description: Access forbidden
 */
router.route("/getUserBookedEvent").get(authController_1.protectedRoute, bookingController_1.getAUserEventBookings);
exports.default = router;
