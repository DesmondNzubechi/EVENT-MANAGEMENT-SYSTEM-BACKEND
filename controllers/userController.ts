import User from "../models/userModel";
import { Response, Request, NextFunction, CookieOptions } from "express";
import catchAsync from "../utils/catchAsync";
import { AppError } from "../errors/appError";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { verifyTokenAndGetUser } from "../utils/verifyTokenAndGetUser";
import { sendEmail } from "../utils/sendEmail";
import crypto from "crypto";
import { AppResponse } from "../utils/appResponse";
import { generatEmailVerificationCode } from "../utils/emailVerificationCode";

config({ path: "./config.env" });

const { JWT_EXPIRES_IN, JWT_SECRET, JWT_COOKIE_EXPIRES, ORIGIN_URL } =
  process.env;

if (!JWT_EXPIRES_IN || !JWT_SECRET || !JWT_COOKIE_EXPIRES || !ORIGIN_URL) {
  throw new AppError(
    "Kindly make sure that these env variable are defined",
    400
  );
}

//FOR FETCHING ALL THE USER
export const getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(new AppError("Something went wrong. Please try again", 400));
  }
  return AppResponse(res, 200, "success", "fetching users succesful", users);
});

//FOR FETCHING A USER USING ITS ID
export const getAUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const theUser = await User.findById(id);

  if (!theUser) {
    return next(new AppError("Something went wrong. Please try again", 400));
  }
  return AppResponse(res, 200, "success", "fetching user succesful", theUser);
});

//FOR CREATING A USER, THIS WILL ONLY BE ACCESIBLE TO ADMIN
export const createAUser = catchAsync(async (req, res, next) => {
  const { fullName, email, password, confirmPassword, role } = req.body;

  //find user by email
  const userExistWithEmail = await User.findOne({ email });

  //if user already exist with the provided email, return an error message
  if (userExistWithEmail) {
    return next(new AppError("user already exist with email", 400));
  }

  if (!fullName || !email || !password || !confirmPassword) {
    return next(new AppError("Kindly fill in the required field", 400));
  }

  const user = await User.create({
    fullName,
    email,
    password,
    confirmPassword,
    role,
  });

  const verificationCode = await generatEmailVerificationCode();
  const verificationMessage =
    "Thank you for signing up for The Uevent! To start booking your favorite events, please verify your email using the verification code below. Note: This code will expire in 30 minutes.";

  user.emailVerificationCode = verificationCode;
  user.emailVerificationCodeExpires = Date.now() + 30 * 60 * 1000;

  await user.save();

  sendEmail({
    name: user.fullName,
    email: user.email,
    subject: "VERIFY YOUR EMAIL",
    message: verificationMessage,
    vCode: verificationCode,
    link: ORIGIN_URL,
    linkName: "Visit our website",
  });

  return AppResponse(
    res,
    201,
    "success",
    "user registration successful. Kindly verify your account using the code that was sent to the email you provided.",
    null
  );
});

//FOR UPDATING USER INFO
export const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userUpdateInfo = req.body;

  if (Object.keys(userUpdateInfo).length === 0) {
    return next(new AppError("No data provided for update", 400));
  }

  if (userUpdateInfo.password || userUpdateInfo.confirmPassword) {
    return next(
      new AppError("This is not the route for updating password", 401)
    );
  }

  const updatedUser = await User.findByIdAndUpdate(id, userUpdateInfo, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError("User does not exist", 404));
  }

  return AppResponse(
    res,
    200,
    "success",
    "User successfully updated",
    updatedUser
  );
});


export const deleteAUser = catchAsync(async (req, res, next) => {

    await User.findByIdAndUpdate(req.params.id, { active: false });
    
  return AppResponse(res, 204, "success", "deleted successfully", null);
});
