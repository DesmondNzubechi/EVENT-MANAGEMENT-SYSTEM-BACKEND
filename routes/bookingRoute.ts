import express from "express";
import { protectedRoute, restrictedRoute } from "../controllers/authController";
import {
  confirmBooking,
  createEventBooking,
  getAllTheEventBooked,
  getAUserEventBookings,
} from "../controllers/bookingController";

const router = express.Router();

router.route("/bookEvent/:eventId").post(protectedRoute, createEventBooking);

router
  .route("/bookEvent/confirmPayment/:bookingId")
  .get(protectedRoute, confirmBooking);

router
  .route("/getAllTheEventBookings")
  .get(protectedRoute, restrictedRoute(["admin"]), getAllTheEventBooked);

router.route("/getUserBookedEvent").get(protectedRoute, getAUserEventBookings);

export default router;
