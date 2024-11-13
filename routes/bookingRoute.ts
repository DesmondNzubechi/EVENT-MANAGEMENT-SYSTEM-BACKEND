// import express from "express";
// import { protectedRoute, restrictedRoute } from "../controllers/authController";
// import {
//   confirmBooking,
//   createEventBooking,
//   getAllTheEventBooked,
//   getAUserEventBookings,
// } from "../controllers/bookingController";

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


import express from "express";
import { protectedRoute, restrictedRoute } from "../controllers/authController";
import {
  confirmBooking,
  createEventBooking,
  getAllTheEventBooked,
  getAUserEventBookings,
} from "../controllers/bookingController";

const router = express.Router();

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
router.route("/bookEvent/:eventId").post(protectedRoute, createEventBooking);

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
  .get(protectedRoute, confirmBooking);

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
  .get(protectedRoute, restrictedRoute(["admin"]), getAllTheEventBooked);

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
router.route("/getUserBookedEvent").get(protectedRoute, getAUserEventBookings);

export default router;
