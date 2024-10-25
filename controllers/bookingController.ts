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

        const booking = await Booking.create({
          user: user.id,
          event: eventId,
          paymentReference, // Store payment reference for verification later
        });

        const message =
          "Kindly confirm the payment if you have completed the payment so that the payment receipt will be sent to you. ";

        sendEventBookingEmail({
          fullName: user.fullName,
          message: message,
          title: theEvent.title,
          price: theEvent.price,
          location: theEvent.location,
          date: theEvent.date,
          email: user.email,
          link: `${process.env.ORIGIN_URL}/booking/confirmpayment/${booking.id}`,
          linkName: "Confirm Payment",
          subject: "CONFIRM YOUR TICKET PAYMENT",
          paymentStatus: "pending",
        });

        return AppResponse(
          res,
          201,
          "success",
          "Payment initiated, event successfully booked. Check you email after completing the payment to confirm booking.",
          {
            booking,
            paymentUrl: response.data.authorization_url,
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
    return next(
      new AppError("Payment initialization failed. Please try again", 500)
    );
  });

  reqPaystack.write(params);
  reqPaystack.end();
});

// export const confirmBooking = catchAsync(async (req, res, next) => {
//   const { bookingId } = req.params;

//   const booking = await Booking.findById(bookingId)
//     .populate("events")
//     .populate("user");

//   if (!booking) {
//     return next(
//       new AppError(
//         "Could not find booking. Make sure you booked this event",
//         400
//       )
//     );
//   }

//   const event = await Events.findById(booking.event);

//   if (!event) {
//     return next(new AppError("Event no found!", 400));
//   }

// const options = {
//   hostname: 'api.paystack.co',
//   port: 443,
//   path: `/transaction/verify/${booking.paymentReference}`,
//   method: 'GET',
//   headers: {
//     Authorization: `Bearer ${process.env.TEST_URL}`
//   }
// }

// https.request(options, res => {
//   let data = ''

//   res.on('data', (chunk) => {
//     data += chunk
//   });

//   const response = JSON.parse(data);

//   if (response.data.status) {

//   const ticketNumber = booking.event.bookedTicket + 1;

//   const message =
//     "Kindly confirm the payment if you have completed the payment so that the payment receipt will be sent to you. ";

//   const receiptDetails = {
//     fullName: booking.user.fullName,
//     message: message,
//     title: booking.event.title,
//     price: booking.event.price,
//     location: booking.event.location,
//     date: booking.event.date,
//     email: booking.user.email,
//     ticketNumber,
//   };

//   const receiptBuffer = await generateReceiptPdf(receiptDetails);

//   const receiptUrl = await uploadFileToCloudinary(
//     receiptBuffer,
//     "receipts",
//     "raw",
//     "pdf"
//   );

//   event.bookedTicket = event.bookedTicket++;
//   event.availableTicket = event.availableTicket--;
//   event.bookieEmail.push(booking.user.email);
//   booking.paymentStatus = "Confirmed";
//   booking.receiptUrl = receiptUrl.secure_url;

//   await event.save();
//   await booking.save();

//   sendEventBookingEmail({
//     fullName: receiptDetails.fullName,
//     message: message,
//     title: receiptDetails.title,
//     price: receiptDetails.price,
//     location: receiptDetails.location,
//     date: receiptDetails.date,
//     email: receiptDetails.email,
//     link: receiptUrl.secure_url,
//     linkName: "download receipt",
//     subject: "EVENT TICKET PAYMENT RECEIPT",
//     paymentStatus: "Confirmed",
//   });
//   }

//   res.on('end', () => {
//     console.log(JSON.parse(data))
//   })
// }).on('error', error => {
//   console.error(error)
// })

// });

export const confirmBooking = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;

  // Fetch booking details with populated event and user
  const booking = await Booking.findById(bookingId)
    .populate("event")
    .populate("user");

  if (!booking) {
    return next(
      new AppError("Could not find booking. Ensure you booked this event", 400)
    );
  }

  const event = await Events.findById(booking.event.id);
  if (!event) {
    return next(new AppError("Event not found!", 400));
  }

  if (booking.paymentStatus === "confirmed") {
    return next(new AppError("This receipt is already confirmed.", 400));
  }

  // Define Paystack options for verification
  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: `/transaction/verify/${booking.paymentReference}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.TEST_URL}`,
    },
  };

  // Create a promise for the Paystack request
  const response = await new Promise<any>((resolve, reject) => {
    const reqPaystack = https.request(options, (resPaystack) => {
      let data = "";

      resPaystack.on("data", (chunk) => (data += chunk));
      resPaystack.on("end", () => resolve(JSON.parse(data)));
    });

    reqPaystack.on("error", (error) =>
      reject(new AppError("Payment verification failed", 500))
    );
    reqPaystack.end();
  });
  console.log(response.data.status, "The response man");
  // Check the payment status
  if (response.data.status) {
    // Increment booked ticket count and decrement available tickets
    event.bookedTicket += 1;
    event.availableTicket -= 1;
    event.bookieEmail.push(booking.user.email);

    // Update booking status and generate receipt
    booking.paymentStatus = "confirmed";
    const ticketNumber = event.bookedTicket;

    // Prepare receipt details and generate PDF
    const receiptDetails = {
      fullName: booking.user.fullName,
      title: event.title,
      price: event.price,
      location: event.location,
      date: event.date,
      email: booking.user.email,
      ticketNumber,
      message: "Payment confirmed. Download your receipt below.",
    };

    const receiptBuffer = await generateReceiptPdf(receiptDetails);
    const receiptUrl = await uploadFileToCloudinary(
      receiptBuffer,
      "receipts",
      "raw",
      "pdf"
    );

    booking.receiptUrl = receiptUrl.secure_url;
    await event.save();
    await booking.save();

    // Send confirmation email with receipt link
    sendEventBookingEmail({
      fullName: receiptDetails.fullName,
      title: receiptDetails.title,
      price: receiptDetails.price,
      location: receiptDetails.location,
      date: receiptDetails.date,
      email: receiptDetails.email,
      link: receiptUrl.secure_url,
      linkName: "Download Receipt",
      subject: "EVENT TICKET PAYMENT RECEIPT",
      paymentStatus: "Confirmed",
      message: "Event Ticket Payment confirmed.",
      ticketNumber,
    });

    return AppResponse(
      res,
      200,
      "success",
      "Booking confirmed, receipt sent to your email.",
      {
        booking,
        receiptUrl: receiptUrl.secure_url,
      }
    );
  } else {
    return next(
      new AppError("Payment verification failed. Please try again.", 500)
    );
  }
});

export const getAllTheEventBooked = catchAsync(async (req, res, next) => {
  const allBooking = await Booking.find().populate("Events").populate("users");

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
