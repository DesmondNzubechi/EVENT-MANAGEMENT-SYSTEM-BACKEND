"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = require("./appError");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: "./config.env" });
const { NODE_ENV } = process.env;
//ERROR HANDLING FOR CAST ERROR
const handleCastErrorDB = (err) => {
    const message = `Invalid input : ${err.value}`;
    return new appError_1.AppError(message, 400);
};
//ERROR HANDLING FOR DUPLICATED FIELD
const handleDuplicateFields = (err) => {
    const match = err.message.match(/(["'])(\\?.)*?\1/);
    const value = match ? match[0] : "Unknown Value";
    const message = `This field is duplicated: ${value}. Kindly use another value`;
    return new appError_1.AppError(message, 400);
};
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Validation error: ${errors.join(". ")}`;
    return new appError_1.AppError(message, 400);
};
// Error handler for JWT Errors
const handleJWTErr = () => new appError_1.AppError("Invalid token. Please login again", 401);
const handleJWTExpiredError = () => new appError_1.AppError("Your token already expired. Please login again", 401);
const sendDevError = (err, res) => {
    res.status(err.statusCode || 500).json({
        status: err.status || "error",
        message: err.message,
        error: err,
        stack: err.stack,
    });
};
const sendProdError = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
        res.status(500).json({
            status: "error",
            message: "Something went wrong. Please try again",
        });
    }
};
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 404;
    err.status = err.status || "error";
    if (NODE_ENV === "development") {
        sendDevError(err, res);
    }
    else {
        let error = Object.assign({}, err);
        if (error.name === "castError")
            error = handleCastErrorDB(error);
        if (error.code === 11000)
            error = handleDuplicateFields(error);
        if (error.name === "validationError")
            error = handleValidationError(error);
        if (error.name === "JsonWebTokenError")
            error = handleJWTErr();
        if (error.name === "TokenExpiredError")
            error = handleJWTExpiredError();
        sendProdError(err, res);
    }
};
exports.default = globalErrorHandler;
