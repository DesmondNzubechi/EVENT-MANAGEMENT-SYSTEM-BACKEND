"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { model, Schema } = mongoose_1.default;
const bookingSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: "users",
    },
    event: {
        type: Schema.ObjectId,
        ref: "Events",
    },
    paymentStatus: {
        type: String,
        required: [true, "Paytment status is required"],
        enum: ["confirmed", "pending"],
        default: "pending",
    },
    ticketQuantity: {
        type: Number,
        default: 1,
    },
    dateBooked: {
        type: Date,
        default: Date.now,
    },
    paymentReference: {
        type: String,
    },
    dateConfirmed: {
        type: Date,
        default: Date.now,
    },
    receiptUrl: {
        type: String,
    },
});
exports.Booking = model("bookings", bookingSchema);
