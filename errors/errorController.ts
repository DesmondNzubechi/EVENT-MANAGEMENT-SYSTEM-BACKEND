import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppError } from "./appError";
import { config } from "dotenv";

config({ path: "./config.env" });

const { NODE_ENV } = process.env;

//TYPES FOR SPECIFIC MONGOOSE ERROR
type castError = mongoose.Error.CastError;
type validatorError = mongoose.Error.ValidationError;

//ERROR HANDLING FOR CAST ERROR
const handleCastErrorDB = (err: castError): AppError => {
  const message = `Invalid input : ${err.value}`;
  return new AppError(message, 400);
};

//ERROR HANDLING FOR DUPLICATED FIELD
const handleDuplicateFields = (err: mongoose.Error): AppError => {
  const match = err.message.match(/(["'])(\\?.)*?\1/);
  const value = match ? match[0] : "Unknown Value";
  const message = `This field is duplicated: ${value}. Kindly use another value`;
  return new AppError(message, 400);
};

const handleValidationError = (err: validatorError): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Validation error: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendDevError = (err: AppError, res: Response): void => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendProdError = (err: AppError, res: Response): void => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong. Please try again",
    });
  }
};

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 404;
  err.status = err.status || "error";

  if (NODE_ENV === "development") {
    sendDevError(err, res);
  } else {
    let error = { ...err };

    if (error.name === "castError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFields(error);
    if (error.name === "validationError") error = handleValidationError(error);

    sendProdError(err, res);
  }
};

export default globalErrorHandler;
