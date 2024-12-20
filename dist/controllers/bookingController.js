"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAUserEventBookings = exports.getAllConfirmedEventBooked = exports.getAllTheEventBooked = exports.confirmBooking = exports.createEventBooking = void 0;
const appError_1 = require("../errors/appError");
const bookingModel_1 = require("../models/bookingModel");
const eventModel_1 = require("../models/eventModel");
const appResponse_1 = require("../utils/appResponse");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const verifyTokenAndGetUser_1 = require("../utils/verifyTokenAndGetUser");
const https_1 = __importDefault(require("https"));
const dotenv_1 = require("dotenv");
const sendBookingEmail_1 = require("../utils/sendBookingEmail");
const generateReceiptPdf_1 = require("../utils/generateReceiptPdf");
const uploadToCloudinary_1 = require("../utils/uploadToCloudinary");
(0, dotenv_1.configDotenv)({ path: "./config.env" });
const { ORIGIN_URL, TEST_URL } = process.env;
exports.createEventBooking = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt;
    if (!token) {
        return next(new appError_1.AppError("You are not authorized to perform this action. Please login", 400));
    }
    const user = yield (0, verifyTokenAndGetUser_1.verifyTokenAndGetUser)(token, next);
    if (!user) {
        return next(new appError_1.AppError("User not found. Please login", 404));
    }
    const { eventId } = req.params;
    const theEvent = yield eventModel_1.Events.findById(eventId);
    if (!theEvent) {
        return next(new appError_1.AppError("This event does not exist.", 404));
    }
    if (theEvent.availableTicket === 0 ||
        theEvent.bookedTicket === theEvent.totalTicket) {
        return next(new appError_1.AppError("You can't book this event again because the allocated Ticket has finished.", 400));
    }
    const ticketNumber = theEvent.bookedTicket + 1; // Get the next available ticket number
    const params = JSON.stringify({
        email: user.email, // Use the logged-in user's email
        amount: theEvent.price * 100, // Multiply by 100 because Paystack expects the amount in kobo (smallest currency unit)
        callback_url: ORIGIN_URL,
        metadata: {
            custom_fields: [
                {
                    display_name: "Full Name",
                    variable_name: "fullname",
                    value: user.fullName,
                },
                {
                    display_name: "Email",
                    variable_name: "email",
                    value: user.email,
                },
                {
                    display_name: "User ID",
                    variable_name: "userId",
                    value: user.id,
                },
                {
                    display_name: "Event Name",
                    variable_name: "eventName",
                    value: theEvent.title,
                },
                {
                    display_name: "Event Ticket Price",
                    variable_name: "eventTicketPrice",
                    value: theEvent.price,
                },
                {
                    display_name: "Event Date",
                    variable_name: "eventDate",
                    value: theEvent.date,
                },
                {
                    display_name: "Event Location",
                    variable_name: "eventLocation",
                    value: theEvent.location,
                },
                {
                    display_name: "Ticket No.",
                    variable_name: "ticketNo",
                    value: ticketNumber,
                },
                {
                    display_name: "Time Booked",
                    variable_name: "timeBooked",
                    value: new Date().toISOString(),
                },
            ],
        },
    });
    const options = {
        hostname: "api.paystack.co",
        port: 443,
        path: "/transaction/initialize",
        method: "POST",
        headers: {
            Authorization: `Bearer ${TEST_URL}`,
            "Content-Type": "application/json",
        },
    };
    const reqPaystack = https_1.default.request(options, (resPaystack) => {
        let data = "";
        resPaystack.on("data", (chunk) => {
            data += chunk;
        });
        resPaystack.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = JSON.parse(data);
            if (response.status) {
                // Payment initialization was successful
                const paymentReference = response.data.reference;
                const booking = yield bookingModel_1.Booking.create({
                    user: user.id,
                    event: eventId,
                    paymentReference, // Store payment reference for verification later
                });
                const message = "Kindly confirm the payment if you have completed the payment so that the payment receipt will be sent to you. ";
                (0, sendBookingEmail_1.sendEventBookingEmail)({
                    fullName: user.fullName,
                    message: message,
                    title: theEvent.title,
                    price: theEvent.price,
                    location: theEvent.location,
                    date: theEvent.date,
                    email: user.email,
                    link: `${process.env.ORIGIN_URL}/booking/confirmpayment/${booking.id}`,
                    linkName: "Confirm Payment",
                    subject: "CONFIRM YOUR TICKET PAYMENT",
                    paymentStatus: "pending",
                });
                return (0, appResponse_1.AppResponse)(res, 201, "success", "Payment initiated, event successfully booked. Check you email after completing the payment to confirm booking.", {
                    booking,
                    paymentUrl: response.data.authorization_url,
                });
            }
            else {
                return next(new appError_1.AppError("Payment initiation failed. Please try again.", 500));
            }
        }));
    });
    reqPaystack.on("error", (error) => {
        console.error("Error making request to Paystack:", error);
        return next(new appError_1.AppError("Payment initialization failed. Please try again", 500));
    });
    reqPaystack.write(params);
    reqPaystack.end();
}));
//CONFIRM EVENT BOOKING AND SEND PAYMENT RECEIPT
exports.confirmBooking = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId } = req.params;
    // Fetch booking details with populated event and user
    const booking = yield bookingModel_1.Booking.findById(bookingId)
        .populate("event")
        .populate("user");
    if (!booking) {
        return next(new appError_1.AppError("Could not find booking. Ensure you booked this event", 400));
    }
    const event = yield eventModel_1.Events.findById(booking.event.id);
    if (!event) {
        return next(new appError_1.AppError("Event not found!", 400));
    }
    if (booking.paymentStatus === "confirmed") {
        return next(new appError_1.AppError("This receipt is already confirmed.", 400));
    }
    // Define Paystack options for verification
    const options = {
        hostname: "api.paystack.co",
        port: 443,
        path: `/transaction/verify/${booking.paymentReference}`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.TEST_URL}`,
        },
    };
    // Create a promise for the Paystack request
    const response = yield new Promise((resolve, reject) => {
        const reqPaystack = https_1.default.request(options, (resPaystack) => {
            let data = "";
            resPaystack.on("data", (chunk) => (data += chunk));
            resPaystack.on("end", () => resolve(JSON.parse(data)));
        });
        reqPaystack.on("error", (error) => reject(new appError_1.AppError("Payment verification failed", 500)));
        reqPaystack.end();
    });
    console.log(response.data.status, "The response man");
    // Check the payment status
    if (response.data.status) {
        // Increment booked ticket count and decrement available tickets
        event.bookedTicket += 1;
        event.availableTicket -= 1;
        event.bookieEmail.push(booking.user.email);
        // Update booking status and generate receipt
        booking.paymentStatus = "confirmed";
        const ticketNumber = event.bookedTicket;
        // Prepare receipt details and generate PDF
        const receiptDetails = {
            fullName: booking.user.fullName,
            title: event.title,
            price: event.price,
            location: event.location,
            date: event.date,
            email: booking.user.email,
            ticketNumber,
            message: "Payment confirmed. Download your receipt below.",
        };
        const receiptBuffer = yield (0, generateReceiptPdf_1.generateReceiptPdf)(receiptDetails);
        const receiptUrl = yield (0, uploadToCloudinary_1.uploadFileToCloudinary)(receiptBuffer, "receipts", "raw", "pdf");
        booking.receiptUrl = receiptUrl.secure_url;
        yield event.save();
        yield booking.save();
        // Send confirmation email with receipt link
        (0, sendBookingEmail_1.sendEventBookingEmail)({
            fullName: receiptDetails.fullName,
            title: receiptDetails.title,
            price: receiptDetails.price,
            location: receiptDetails.location,
            date: receiptDetails.date,
            email: receiptDetails.email,
            link: receiptUrl.secure_url,
            linkName: "Download Receipt",
            subject: "EVENT TICKET PAYMENT RECEIPT",
            paymentStatus: "Confirmed",
            message: "Event Ticket Payment confirmed.",
            ticketNumber,
        });
        return (0, appResponse_1.AppResponse)(res, 200, "success", "Booking confirmed, receipt sent to your email.", {
            booking,
            receiptUrl: receiptUrl.secure_url,
        });
    }
    else {
        return next(new appError_1.AppError("Payment verification failed. Please try again.", 500));
    }
}));
//FETCH ALL BOOKED EVENT
exports.getAllTheEventBooked = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allBooking = yield bookingModel_1.Booking.find().populate("Events").populate("users");
    if (!allBooking) {
        return next(new appError_1.AppError("Could not fetch booked events. Please try again", 400));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "booked event successfully fetched", allBooking);
}));
//FETCH ALL BOOKED EVENT
exports.getAllConfirmedEventBooked = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allBooking = yield bookingModel_1.Booking.find({ paymentStatus: "confirmed" })
        .populate("Events")
        .populate("users");
    if (!allBooking) {
        return next(new appError_1.AppError("Could not fetch booked events. Please try again", 400));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "All confirmed booked event successfully fetched", allBooking);
}));
exports.getAUserEventBookings = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt;
    if (!token) {
        return next(new appError_1.AppError("You are not authorized to access this route.", 400));
    }
    const user = yield (0, verifyTokenAndGetUser_1.verifyTokenAndGetUser)(token, next);
    if (!user) {
        return next(new appError_1.AppError("Something went wrong. Please try again", 400));
    }
    const userBookings = yield bookingModel_1.Booking.find({ user: user.id }).populate("events");
    if (!userBookings) {
        return next(new appError_1.AppError("Could not fetch booking by the user. please try again", 400));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "Users booking successfully fetched", userBookings);
}));
