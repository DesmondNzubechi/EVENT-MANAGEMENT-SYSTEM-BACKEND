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
exports.unPublishEvent = exports.publishEvent = exports.updateEvent = exports.getAllUnPublishedEvents = exports.getAllPublishedEvents = exports.getAllEvent = exports.createEvent = void 0;
const appError_1 = require("../errors/appError");
const eventModel_1 = require("../models/eventModel");
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const sendEmail_1 = require("../utils/sendEmail");
const dotenv_1 = require("dotenv");
const sendEventEmail_1 = require("../utils/sendEventEmail");
const appResponse_1 = require("../utils/appResponse");
const uploadToCloudinary_1 = require("../utils/uploadToCloudinary");
(0, dotenv_1.configDotenv)({ path: "./config.env" });
const { ORIGIN_URL } = process.env;
if (!ORIGIN_URL) {
    throw new appError_1.AppError("Please make sure that this env variable is defined", 400);
}
//CREATE AN EVENT
exports.createEvent = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, price, location, date, totalTicket } = req.body;
    if (!title || !description || !price || !location || !date || !totalTicket) {
        return next(new appError_1.AppError("Kindly fill in the required field", 400));
    }
    if (!req.file) {
        return next(new appError_1.AppError("Kindly upload an image for this event", 400));
    }
    const imageUrl = yield (0, uploadToCloudinary_1.uploadFileToCloudinary)(req.file.buffer, "images", "image", "jpg");
    const event = yield eventModel_1.Events.create({
        title,
        description,
        price,
        location,
        date,
        totalTicket,
        availableTicket: totalTicket,
        image: imageUrl.secure_url,
    });
    if (!event) {
        return next(new appError_1.AppError("An error occured while creating this event. Please try again", 400));
    }
    res.status(201).json({
        status: "success",
        message: "event successfully created",
        data: {
            event,
        },
    });
}));
//FETCH ALL CREATED EVENT
exports.getAllEvent = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield eventModel_1.Events.find();
    if (!events) {
        return next(new appError_1.AppError("An error occured while fetching this. Please try again", 400));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "events successfully fetched", events);
}));
//FETCH ALL PUBLISHED EVENT
exports.getAllPublishedEvents = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield eventModel_1.Events.find({ status: "published" });
    if (!events) {
        return next(new appError_1.AppError("An error occured while fetching this. Please try again", 400));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "published events successfully fetched", events);
}));
exports.getAllUnPublishedEvents = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const events = yield eventModel_1.Events.find({ status: "unpublished" });
    if (!events) {
        return next(new appError_1.AppError("An error occured while fetching this. Please try again", 400));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "unpublished events successfully fetched", events);
}));
// UPDATE AN EVENT POST
exports.updateEvent = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const eventExist = yield eventModel_1.Events.findById(id);
    // Handle case when event is not found
    if (!eventExist) {
        return next(new appError_1.AppError("The event you are trying to access does not exist.", 404));
    }
    // Update the event
    const event = yield eventModel_1.Events.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        new: true,
    });
    // Handle case when event is not found
    if (!event) {
        return next(new appError_1.AppError("Something went wrong. Please try again", 400));
    }
    // Get list of bookie IDs from the event
    const bookieIds = event.bookieId;
    // Fetch all users (bookies) who booked the event
    const allBookies = yield userModel_1.default.find({ _id: { $in: bookieIds } });
    // Get all emails and full names
    const allEmails = allBookies.map((bookie) => bookie.email);
    const allNames = allBookies.map((bookie) => bookie.fullName);
    // Event URL for users to check the update
    const eventUrl = `${ORIGIN_URL}/events/${event.id}`;
    // Message to be sent
    const message = `There is a new update to the event that you are attending. Kindly check it below.`;
    // Loop through each bookie and send an individual email
    for (let i = 0; i < allBookies.length; i++) {
        yield (0, sendEventEmail_1.sendEventEmail)({
            message: message,
            subject: "YOUR EVENT UPDATE",
            email: allEmails[i],
            name: allNames[i],
            link: `${ORIGIN_URL}/events/${event.id}`,
            linkName: "view event",
        });
    }
    // Respond with success after the event and emails are updated
    return (0, appResponse_1.AppResponse)(res, 200, "success", "Event successfully updated, and emails sent to users", event);
}));
//PUBLISH AN EVENT POST
exports.publishEvent = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const event = yield eventModel_1.Events.findByIdAndUpdate(id, { status: "published" }, {
        new: true,
        runValidators: true,
    });
    if (!event) {
        return next(new appError_1.AppError("Something went wrong while publishing this event. Please try again", 400));
    }
    const allUser = yield userModel_1.default.find();
    if (!allUser) {
        return next(new appError_1.AppError("Could not fetch users to update them about this event. Please try again", 400));
    }
    const allUserEmail = allUser.map((user) => user.email);
    const allUserFullname = allUser.map((user) => user.fullName);
    const eventUrl = `${ORIGIN_URL}/events/${event.id}`;
    const message = `There is a new event for you! I know you won't want to miss it. Kindly check it out!`;
    for (let i = 0; i < allUser.length; i++) {
        yield (0, sendEmail_1.sendEmail)({
            name: allUserFullname[i],
            email: allUserEmail[i],
            message: message,
            subject: "YOU HAVE NEW EVENT TO CHECK OUT",
            link: eventUrl,
            linkName: "View Event",
        });
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "Event successfully published", event);
}));
//UNPUBLISH AN EVENT POST
exports.unPublishEvent = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const event = yield eventModel_1.Events.findByIdAndUpdate(id, { status: "unpublished" }, {
        new: true,
        runValidators: true,
    });
    return (0, appResponse_1.AppResponse)(res, 200, "success", "Event successfully unpublished", event);
}));
//DELETE EVENT
exports.deleteAnEvent = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield eventModel_1.Events.findByIdAndDelete(id, req.body);
    //SUCCESS RESPONSE
    return (0, appResponse_1.AppResponse)(res, 200, "success", "An event deleted successfully", null);
}));
