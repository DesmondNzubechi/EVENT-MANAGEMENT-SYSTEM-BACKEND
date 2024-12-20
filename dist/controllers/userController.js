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
exports.deleteAUser = exports.updateUser = exports.createAUser = exports.getAUser = exports.getAllUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = require("../errors/appError");
const dotenv_1 = require("dotenv");
const sendEmail_1 = require("../utils/sendEmail");
const appResponse_1 = require("../utils/appResponse");
const emailVerificationCode_1 = require("../utils/emailVerificationCode");
(0, dotenv_1.config)({ path: "./config.env" });
const { JWT_EXPIRES_IN, JWT_SECRET, JWT_COOKIE_EXPIRES, ORIGIN_URL } = process.env;
if (!JWT_EXPIRES_IN || !JWT_SECRET || !JWT_COOKIE_EXPIRES || !ORIGIN_URL) {
    throw new appError_1.AppError("Kindly make sure that these env variable are defined", 400);
}
//FOR FETCHING ALL THE USER
exports.getAllUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel_1.default.find();
    if (!users) {
        return next(new appError_1.AppError("Something went wrong. Please try again", 400));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "fetching users succesful", users);
}));
//FOR FETCHING A USER USING ITS ID
exports.getAUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const theUser = yield userModel_1.default.findById(id);
    if (!theUser) {
        return next(new appError_1.AppError("Something went wrong. Please try again", 400));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "fetching user succesful", theUser);
}));
//FOR CREATING A USER, THIS WILL ONLY BE ACCESIBLE TO ADMIN
exports.createAUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password, confirmPassword, role } = req.body;
    //find user by email
    const userExistWithEmail = yield userModel_1.default.findOne({ email });
    //if user already exist with the provided email, return an error message
    if (userExistWithEmail) {
        return next(new appError_1.AppError("user already exist with email", 400));
    }
    if (!fullName || !email || !password || !confirmPassword) {
        return next(new appError_1.AppError("Kindly fill in the required field", 400));
    }
    const user = yield userModel_1.default.create({
        fullName,
        email,
        password,
        confirmPassword,
        role,
    });
    const verificationCode = yield (0, emailVerificationCode_1.generatEmailVerificationCode)();
    const verificationMessage = "Thank you for signing up for The Uevent! To start booking your favorite events, please verify your email using the verification code below. Note: This code will expire in 30 minutes.";
    user.emailVerificationCode = verificationCode;
    user.emailVerificationCodeExpires = Date.now() + 30 * 60 * 1000;
    yield user.save();
    (0, sendEmail_1.sendEmail)({
        name: user.fullName,
        email: user.email,
        subject: "VERIFY YOUR EMAIL",
        message: verificationMessage,
        vCode: verificationCode,
        link: ORIGIN_URL,
        linkName: "Visit our website",
    });
    return (0, appResponse_1.AppResponse)(res, 201, "success", "user registration successful. Kindly verify your account using the code that was sent to the email you provided.", null);
}));
//FOR UPDATING USER INFO
exports.updateUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userUpdateInfo = req.body;
    if (Object.keys(userUpdateInfo).length === 0) {
        return next(new appError_1.AppError("No data provided for update", 400));
    }
    if (userUpdateInfo.password || userUpdateInfo.confirmPassword) {
        return next(new appError_1.AppError("This is not the route for updating password", 401));
    }
    const updatedUser = yield userModel_1.default.findByIdAndUpdate(id, userUpdateInfo, {
        new: true,
        runValidators: true,
    });
    if (!updatedUser) {
        return next(new appError_1.AppError("User does not exist", 404));
    }
    return (0, appResponse_1.AppResponse)(res, 200, "success", "User successfully updated", updatedUser);
}));
exports.deleteAUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_1.default.findByIdAndUpdate(req.params.id, { active: false });
    return (0, appResponse_1.AppResponse)(res, 204, "success", "deleted successfully", null);
}));
