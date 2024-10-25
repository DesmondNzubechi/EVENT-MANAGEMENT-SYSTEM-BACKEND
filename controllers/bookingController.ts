import { AppError } from "../errors/appError";
import { Booking } from "../models/bookingModel";
import { Events } from "../models/eventModel";
import { AppResponse } from "../utils/appResponse";
import catchAsync from "../utils/catchAsync";
import { verifyTokenAndGetUser } from "../utils/verifyTokenAndGetUser";
import https from "https";
import { configDotenv } from "dotenv";
import { sendEventBookingEmail } from "../utils/sendBookingEmail";
import { generateReceiptPdf } from "../utils/generateReceiptPdf";
import { uploadFileToCloudinary } from "../utils/uploadToCloudinary";

configDotenv({ path: "./config.env" });

// export const createEventBooking = catchAsync(async (req, res, next) => {

//   const token = req.cookies.jwt;

//   if (!token) {
//     return next(
//       new AppError(
//         "You are not authorized to perform this action. Please login login",
//         400
//       )
//     );
//   }

//   const user = await verifyTokenAndGetUser(token, next);

//   if (!user) {
//     return next(new AppError("User not found. Please login", 404));
//   }

//   const { eventId } = req.params;

//   const theEvent = await Events.findById(eventId);

//   if(!theEvent){
//     return next(new AppError("This event does not exist.", 404))
//   }

//   if(theEvent.availableTicket === 0 || theEvent.bookedTicket === theEvent.totalTicket){
//     return next(new AppError("You can't book this event again because the allocated Ticket has finished.", 400))
//   }

//   theEvent.availableTicket = theEvent.availableTicket--;
//   theEvent.bookedTicket = theEvent.bookedTicket++

//   await theEvent.save();

//   const { paymentStatus, slots } = req.body;

//   const booking = await Booking.create({
//     user: user.id,
//     event: eventId,
//     slots,
//     paymentStatus,
//   });

//   return AppResponse(res, 201, "success", "Event successfully booked", booking);
// });

export const createEventBooking = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(
      new AppError(
        "You are not authorized to perform this action. Please login",
        400
      )
    );
  }

  const user = await verifyTokenAndGetUser(token, next);

  if (!user) {
    return next(new AppError("User not found. Please login", 404));
  }

  const { eventId } = req.params;

  const theEvent = await Events.findById(eventId);

  if (!theEvent) {
    return next(new AppError("This event does not exist.", 404));
  }

  // // Check if the event date has passed
  // const currentDate = new Date();
  // if (new Date(theEvent.date) < currentDate) {
  //   return next(
  //     new AppError(
  //       "You cannot book this event because the event date has already passed.",
  //       400
  //     )
  //   );
  // }

  if (
    theEvent.availableTicket === 0 ||
    theEvent.bookedTicket === theEvent.totalTicket
  ) {
    return next(
      new AppError(
        "You can't book this event again because the allocated Ticket has finished.",
        400
      )
    );
  }

  const ticketNumber = theEvent.bookedTicket + 1; // Get the next available ticket number

  const params = JSON.stringify({
    email: user.email, // Use the logged-in user's email
    amount: theEvent.price * 100, // Multiply by 100 because Paystack expects the amount in kobo (smallest currency unit)
    callback_url: "https://example.com/",
    metadata: {
      custom_fields: [
        {
          display_name: "Full Name",
          variable_name: "fullname",
          value: user.fullName,
        },
        {
          display_name: "Email",
          variable_name: "email",
          value: user.email,
        },
        {
          display_name: "User ID",
          variable_name: "userId",
          value: user.id,
        },
        {
          display_name: "Event Name",
          variable_name: "eventName",
          value: theEvent.title,
        },
        {
          display_name: "Event Ticket Price",
          variable_name: "eventTicketPrice",
          value: theEvent.price,
        },
        {
          display_name: "Event Date",
          variable_name: "eventDate",
          value: theEvent.date,
        },
        {
          display_name: "Event Location",
          variable_name: "eventLocation",
          value: theEvent.location,
        },
        {
          display_name: "Ticket No.",
          variable_name: "ticketNo",
          value: ticketNumber,
        },
        {
          display_name: "Time Booked",
          variable_name: "timeBooked",
          value: new Date().toISOString(),
        },
      ], 
    },
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TEST_URL}`,
      "Content-Type": "application/json",
    },
  };

  const reqPaystack = https.request(options, (resPaystack) => {
    let data = "";

    resPaystack.on("data", (chunk) => {
      data += chunk;
    });

    resPaystack.on("end", async () => {
      const response = JSON.parse(data);

      if (response.status) {
        // Payment initialization was successful
        const paymentReference = response.data.reference;

        // // Proceed with booking logic
        // theEvent.availableTicket--;
        // theEvent.bookedTicket++;

        // await theEvent.save();

        const booking = await Booking.create({
          user: user.id,
          event: eventId,
          paymentReference, // Store payment reference for verification later
        });
const message = "Thank you for booking your event with The Uevent! Kindly confirm the payment if you have completed the payment so that the payment receipt will be sent to you. "
      

        const receiptDetails = {
          fullName: user.fullName,
          message: message,
          title: theEvent.title,
          price: theEvent.price,
          location: theEvent.location,
        date : theEvent.date,
          email: user.email,
          ticketNumber
        }

        const receiptBuffer = await generateReceiptPdf(receiptDetails)

        const receiptUrl = await uploadFileToCloudinary(receiptBuffer)

        sendEventBookingEmail({
          fullName: user.fullName,
          message: message,
          title: theEvent.title,
          price: theEvent.price,
          location: theEvent.location,
        date : theEvent.date,
          email: user.email,
          link: receiptUrl.secure_url,
          linkName: "download receipt",
          subject: "CONFIRM YOUR TICKET PAYMENT",
          paymentStatus : "pending"
        })
        return AppResponse(
          res,
          201,
          "success",
          "Payment initiated, event successfully booked. Check you email after completing the payment to confirm booking.",
          {
            booking,
            paymentUrl: response.data.authorization_url, // Send the payment URL to the user
            receiptUrl : receiptUrl.secure_url
          }
        );
      } else {
        return next(
          new AppError("Payment initiation failed. Please try again.", 500)
        );
      }
    });
  });

  reqPaystack.on("error", (error) => {
    console.error("Error making request to Paystack:", error);
    return next(new AppError("Payment initialization failed", 500));
  });

  reqPaystack.write(params);
  reqPaystack.end();
 
});









export const confirmBooking = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;
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
