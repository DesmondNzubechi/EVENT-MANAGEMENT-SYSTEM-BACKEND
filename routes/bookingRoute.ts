import express from "express";
import { protectedRoute } from "../controllers/authController";
import {
  createEventBooking,
  getAllTheEventBooked,
  getAUserEventBookings,
} from "../controllers/bookingController";

const router = express.Router();

router.route("/bookEvent/:eventId").post(protectedRoute, createEventBooking);

router
  .route("/getAllTheEventBookings")
  .get(protectedRoute, getAllTheEventBooked);

router.route("/getUserBookedEvent").get(protectedRoute, getAUserEventBookings);

export default router;
