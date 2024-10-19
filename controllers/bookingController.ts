import { AppError } from "../errors/appError";
import { Booking } from "../models/bookingModel";
import { Events } from "../models/eventModel";
import { AppResponse } from "../utils/appResponse";
import catchAsync from "../utils/catchAsync";
import { verifyTokenAndGetUser } from "../utils/verifyTokenAndGetUser";

export const createEventBooking = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(
      new AppError(
        "You are not authorized to perform this action. Please login login",
        400
      )
    );
  }

  const user = await verifyTokenAndGetUser(token, next);

  if (!user) {
    return next(new AppError("User not found. Please login", 404));
  }

  const { eventId } = req.params;
  const { paymentStatus, slots } = req.body;

  const booking = await Booking.create({
    user: user.id,
    event: eventId,
    slots,
    paymentStatus,
  });

  return AppResponse(res, 201, "success", "Event successfully booked", booking);
});

export const getAllTheEventBooked = catchAsync(async (req, res, next) => {
  const allBooking = await Booking.find().populate("event", "user");

  if (!allBooking) {
    return next(
      new AppError("Could not fetch booked events. Please try again", 400)
    );
  }

  return AppResponse(
    res,
    200,
    "success",
    "booked event successfully fetched",
    allBooking
  );
});

export const getAUserEventBookings = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(
      new AppError("You are not authorized to access this route.", 400)
    );
  }

  const user = await verifyTokenAndGetUser(token, next);

  if (!user) {
    return next(new AppError("Something went wrong. Please try again", 400));
  }

  const userBookings = await Events.findById(user.id).populate("events");

  if (!user) {
    return next(
      new AppError("Could not fetch booking by the user. please try again", 400)
    );
  }

  return AppResponse(
    res,
    200,
    "success",
    "Users booking successfully fetched",
    userBookings
  );
});
