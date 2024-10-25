import { AppError } from "../errors/appError";
import { Events } from "../models/eventModel";
import User from "../models/userModel";
import { userType } from "../types/types";
import catchAsync from "../utils/catchAsync";
import { sendEmail } from "../utils/sendEmail";
import { configDotenv } from "dotenv";
import { sendEventEmail } from "../utils/sendEventEmail";
import { AppResponse } from "../utils/appResponse";
import { uploadFileToCloudinary } from "../utils/uploadToCloudinary";

configDotenv({ path: "./config.env" });

const { ORIGIN_URL } = process.env;

if (!ORIGIN_URL) {
  throw new AppError("Please make sure that this env variable is defined", 400);
}

//CREATE AN EVENT
export const createEvent = catchAsync(async (req, res, next) => {
  const { title, description, price, location, date, totalTicket } = req.body;

  if (!title || !description || !price || !location || !date || !totalTicket) {
    return next(new AppError("Kindly fill in the required field", 400));
  }

  if (!req.file) {
    return next(new AppError("Kindly upload an image for this event", 400))
  }

  const imageUrl = await uploadFileToCloudinary(req.file.buffer, "images", "image", 'jpg')

  const event = await Events.create({
    title,
    description,
    price,
    location,
    date,
    totalTicket,
    availableTicket: totalTicket,
    image : imageUrl.secure_url
  });

  if (!event) {
    return next(
      new AppError(
        "An error occured while creating this event. Please try again",
        400
      )
    );
  }

  res.status(201).json({
    status: "success",
    message: "event successfully created",
    data: {
      event,
    },
  });
});

//FETCH ALL CREATED EVENT
export const getAllEvent = catchAsync(async (req, res, next) => {
  const events = await Events.find();

  if (!events) {
    return next(
      new AppError(
        "An error occured while fetching this. Please try again",
        400
      )
    );
  }

  return AppResponse(
    res,
    200,
    "success",
    "events successfully fetched",
    events
  );
});

//FETCH ALL PUBLISHED EVENT
export const getAllPublishedEvents = catchAsync(async (req, res, next) => {
  const events = await Events.find({ status: "published" });

  if (!events) {
    return next(
      new AppError(
        "An error occured while fetching this. Please try again",
        400
      )
    );
  }

  return AppResponse(
    res,
    200,
    "success",
    "published events successfully fetched",
    events
  );
});

// UPDATE AN EVENT POST
export const updateEvent = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Update the event
  const event = await Events.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });

  // Handle case when event is not found
  if (!event) {
    return next(new AppError("Something went wrong. Please try again", 400));
  }

  // Get list of bookie IDs from the event
  const bookieIds = event.bookieId;

  // Fetch all users (bookies) who booked the event
  const allBookies = await User.find({ _id: { $in: bookieIds } });

  // Get all emails and full names
  const allEmails = allBookies.map((bookie) => bookie.email);
  const allNames = allBookies.map((bookie) => bookie.fullName);

  // Event URL for users to check the update
  const eventUrl = `${ORIGIN_URL}/events/${event.id}`;

  // Message to be sent
  const message = `There is a new update to the event that you are attending. Kindly check it below.`;

  // Loop through each bookie and send an individual email
  for (let i = 0; i < allBookies.length; i++) {
    await sendEventEmail({
      message: message,
      subject: "YOUR EVENT UPDATE",
      email: allEmails[i],
      name: allNames[i],
      link: `${ORIGIN_URL}/events/${event.id}`,
      linkName: "view event",
    });
  }

  // Respond with success after the event and emails are updated
  return AppResponse(
    res,
    200,
    "success",
    "Event successfully updated, and emails sent to users",
    event
  );
});

//PUBLISH AN EVENT POST
export const publishEvent = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const event = await Events.findByIdAndUpdate(
    id,
    { status: "published" },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!event) {
    return next(
      new AppError(
        "Something went wrong while publishing this event. Please try again",
        400
      )
    );
  }

  const allUser = await User.find();

  if (!allUser) {
    return next(
      new AppError(
        "Could not fetch users to update them about this event. Please try again",
        400
      )
    );
  }

  const allUserEmail: string[] = allUser.map((user: userType) => user.email);
  const allUserFullname: string[] = allUser.map(
    (user: userType) => user.fullName
  );

  const eventUrl = `${ORIGIN_URL}/events/${event.id}`;
  const message = `There is a new event for you! I know you won't want to miss it. Kindly check it out!`;

  for (let i = 0; i < allUser.length; i++) {
    await sendEmail({
      name: allUserFullname[i],
      email: allUserEmail[i],
      message: message,
      subject: "YOU HAVE NEW EVENT TO CHECK OUT",
      link: eventUrl,
      linkName: "View Event",
    });
  }

  return AppResponse(
    res,
    200,
    "success",
    "Event successfully published",
    event
  );
});

//UNPUBLISH AN EVENT POST
export const unPublishEvent = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const event = await Events.findByIdAndUpdate(
    id,
    { status: "unpublished" },
    {
      new: true,
      runValidators: true,
    }
  );

  return AppResponse(
    res,
    200,
    "success",
    "Event successfully unpublish",
    event
  );
});

//DELETE EVENT
exports.deleteAnEvent = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await Events.findByIdAndDelete(id, req.body);

  //SUCCESS RESPONSE
  return AppResponse(
    res,
    200,
    "success",
    "An event deleted successfully",
    null
  );
});
