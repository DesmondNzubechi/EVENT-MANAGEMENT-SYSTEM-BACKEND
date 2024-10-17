import { AppError } from "../errors/appError";
import { Events } from "../models/eventModel";
import catchAsync from "../utils/catchAsync";


//CREATE AN EVENT
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


//FETCH ALL CREATED EVENT
export const getAllEvent = catchAsync(async (req, res, next) => {
  const events = await Events.find();

  res.status(200).json({
    status: "success",
    message: "events successfully fetched",
    data: {
      events,
    },
  });
});


//FETCH ALL PUBLISHED EVENT
export const getAllPublishedEvents = catchAsync(async (req, res, next) => {
  const events = await Events.find({ status: "published" });

  res.status(200).json({
    status: "success",
    message: "published events successfully fetched",
    data: {
      events,
    },
  });
});


//UPDATE AN EVENT POST
export const updateEvent = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const event = await Events.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: "success",
    message: "Event successfully updated",
    data: {
      event,
    },
  });
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

  res.status(200).json({
    status: "success",
    message: "Event successfully published",
    data: {
      event,
    },
  });
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
  
    res.status(200).json({
      status: "success",
      message: "Event successfully unpublish",
      data: {
        event,
      },
    });
  });
  


  //DELETE EVENT
  exports.deleteAnEvent = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    await Events.findByIdAndDelete(id, req.body);

    //SUCCESS RESPONSE
    res.status(200).json({
        status: "success",
        message: "An event deleted successfully",
        data: {
           data: null
        }
    })
})