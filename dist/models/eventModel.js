"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema, model } = mongoose_1.default;
const eventSchema = new Schema({
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
    totalTicket: {
        type: Number,
        required: [true, "Kindly provide slot available for this event."],
    },
    availableTicket: {
        type: Number,
        required: [
            true,
            "Kindly provide the quantity of ticket available for this event.",
        ],
        default: 0,
    },
    bookedTicket: {
        type: Number,
        required: [true, "Kindly provide slot available for this event."],
        default: 0,
    },
    bookieEmail: {
        type: [String],
        default: [],
    },
    image: {
        type: String,
        required: [true, "Kindly provide an image for this event"],
    },
    bookieId: {
        type: [Schema.ObjectId],
        default: [],
    },
});
exports.Events = model("Events", eventSchema);
