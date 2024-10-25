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
    enum: ["confirmed", "pending"],
    default: 'pending'
  },
  ticketQuantity: {
    type: Number,
    default : 1
  },
  dateBooked: {
    type: Date,
    default: Date.now,
  },
  paymentReference: {
    type : String
  },
  dateConfirmed: {
    type: Date,
    default : Date.now
  }
});

export const Booking = model("bookings", bookingSchema);
