import mongoose from "mongoose";
import { bookingType } from "../types/types";

const { model, Schema } = mongoose;

const bookingSchema = new Schema<bookingType>({
  user: {
    type: Schema.ObjectId,
    ref: "users",
  },
  event: {
    type: Schema.ObjectId,
    ref: "events",
  },
  paymentStatus: {
    type: String,
    required: [true, "Paytment status is required"],
  },
  slots: {
    type: Number,
    required: [true, "Kindly input the slots you are booking."],
  },
  dateBooked: {
    type: Date,
    default: Date.now,
  },
});

export const Booking = model("bookings", bookingSchema);
