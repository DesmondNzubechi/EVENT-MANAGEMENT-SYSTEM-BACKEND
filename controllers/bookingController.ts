import { AppError } from "../errors/appError";
import { Booking } from "../models/bookingModel";
import catchAsync from "../utils/catchAsync";
import { verifyUserAndGetUser } from "../utils/verifyTokenAndGetUser";

export const createBooking = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(
      new AppError(
        "You are not authorized to perform this action. Please login login",
        400
      )
    );
  }

  const user = await verifyUserAndGetUser(token, next);

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

  res.status(201).json({
    status: "success",
    message: "An event successfully booked.",
    data: {
      data: booking,
    },
  });
});
