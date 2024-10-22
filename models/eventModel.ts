import mongoose from "mongoose";
import { eventType } from "../types/types";
import validator from "validator";

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
  totalTicket :{
    type: Number,
    required: [true, "Kindly provide slot available for this event."]
  },
  availableTicket :{
    type: Number,
    required: [true, "Kindly provide slot available for this event."],
  },
  bookedTicket :{
    type: Number,
    required: [true, "Kindly provide slot available for this event."],
    default: 0
  },
  bookieEmail : {
    type : [String],
   default : []
  },
  bookieId: {
    type : [Schema.ObjectId],
    default: []
  }
});

export const Events = model("Events", eventSchema);
