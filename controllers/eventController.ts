import { AppError } from "../errors/appError";
import { Events } from "../models/eventModel";
import catchAsync from "../utils/catchAsync";

export const createEvent = catchAsync(async (req, res, next) => {
  const { title, description, price, location, date } = req.body;

  if (!title || !description || !price || !location || !date) {
    return next(new AppError("Kindly fill in the required field", 400));
  }

  const event = await Events.create({
    title,
    description,
    price,
    location,
    date,
  });

  res.status(201).json({
    status: "success",
    message: "event successfully created",
    data: {
      event,
    },
  });
});
