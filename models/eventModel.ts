import mongoose from "mongoose";
import { eventType } from "../types/types";

const { Schema, model } = mongoose;

const eventSchema = new Schema<eventType>({
  title: {
    type: String,
    required: [true, "Kindly include the event title"],
  },
  description: {
    type: String,
    required: [true, "Kindly include the event description"],
  },
  date: {
    type: String,
    required: [true, "Kindly include the event date"],
  },
  location: {
    type: String,
    required: [true, "Kindly include the event location"],
  },
  price: {
    type: Number,
    required: [true, "Kindly include the event ticket price"],
  },
  createdAt: {
    type: Date,
    required: [true, "Kindly include the event date"],
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: [true, "Kindly include the event updated date"],
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["published", "unpublished"],
    default: "unpublished",
  },
});

export const Events = model("Events", eventSchema);
