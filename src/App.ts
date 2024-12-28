import express, { Response, Request, NextFunction } from "express";
import globalErrorHandler from "./errors/errorController";
import authRoute from "./routes/authRoute";
import eventRoute from "./routes/eventRoute";
import bookingRoute from "./routes/bookingRoute";
import userRoute from "./routes/userRoute";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";

import { config } from "dotenv";

config({ path: "./config.env" });

const { ORIGIN_URL } = process.env;

if (!ORIGIN_URL) {
  throw new Error("Make sure that the origin url and the port is defined");
}

console.log("The origin", ORIGIN_URL);

const app = express();
// CORS configuration
const corsOptions = {
  origin: ORIGIN_URL,
  credentials: true,
  methods: "GET,POST,DELETE,PATCH",
  allowedHeaders: "Content-Type, Authorization, api_key",
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(cookieParser());

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("THIS API IS WORKING AS EXPECTED");
});

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "EVENT BOOKING SYSTEM API",
      version: "1.0.0",
      description:
        "API for managing events, bookings, and users in an event booking platform.",
    },
    servers: [
      {
        url: process.env.backendUrl,
      },
    ],
    components: {
      schemas: {
        event: {
          type: "object",
          required: [
            "title",
            "description",
            "date",
            "price",
            "location",
            "status",
            "totalTicket",
            "availableTicket",
            "bookedTicket",
          ],
          properties: {
            title: { type: "string", description: "Title of the event" },
            description: {
              type: "string",
              description: "Detailed description of the event",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Event creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp of the event",
            },
            date: {
              type: "string",
              format: "date",
              description: "Date of the event",
            },
            price: {
              type: "number",
              description: "Ticket price for the event",
            },
            location: {
              type: "string",
              description: "Location where the event is held",
            },
            status: {
              type: "string",
              description: "Status of the event (e.g., active, canceled)",
            },
            totalTicket: {
              type: "integer",
              description: "Total number of tickets available for the event",
            },
            availableTicket: {
              type: "integer",
              description: "Number of tickets still available",
            },
            bookedTicket: {
              type: "integer",
              description: "Number of tickets already booked",
            },
            bookieEmail: {
              type: "array",
              items: { type: "string", format: "email" },
              description: "List of emails of users who booked the event",
            },
            bookieId: {
              type: "array",
              items: { type: "string", format: "objectId" },
              description: "List of user IDs who booked the event",
            },
            image: {
              type: "string",
              format: "uri",
              description: "URL to the event image",
            },
            id: {
              type: "string",
              format: "objectId",
              description: "Unique identifier for the event",
            },
          },
        },
        user: {
          type: "object",
          required: [
            "fullName",
            "email",
            "password",
            "role",
            "emailVerified",
            "active",
          ],
          properties: {
            fullName: { type: "string", description: "Full name of the user" },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
            },
            password: {
              type: "string",
              format: "password",
              description: "User password",
            },
            role: {
              type: "string",
              description: "Role of the user (e.g., admin, user)",
            },
            id: {
              type: "string",
              format: "objectId",
              description: "Unique identifier for the user",
            },
            emailVerified: {
              type: "boolean",
              description: "Indicates if the user email is verified",
            },
            active: {
              type: "boolean",
              description: "Indicates if the user account is active",
            },
          },
        },
        booking: {
          type: "object",
          required: [
            "user",
            "event",
            "paymentStatus",
            "ticketQuantity",
            "dateBooked",
            "paymentReference",
            "receiptUrl",
          ],
          properties: {
            user: {
              $ref: "#/components/schemas/user",
              description: "User who made the booking",
            },
            event: {
              $ref: "#/components/schemas/event",
              description: "Event being booked",
            },
            paymentStatus: {
              type: "string",
              description:
                "Payment status of the booking (e.g., pending, confirmed)",
            },
            ticketQuantity: {
              type: "integer",
              description: "Number of tickets booked",
            },
            dateBooked: {
              type: "string",
              format: "date-time",
              description: "Date and time the booking was made",
            },
            paymentReference: {
              type: "string",
              description: "Reference code for the payment",
            },
            dateConfirmed: {
              type: "string",
              format: "date-time",
              description: "Date and time the payment was confirmed",
            },
            receiptUrl: {
              type: "string",
              format: "uri",
              description: "URL to the payment receipt",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // Path to your route files
};

 const swaggerDocs = swaggerJsDoc(swaggerOptions);
// app.use(
//   "/api-docs",
//   express.static("node_modules/swagger-ui-dist/", { index: false }),
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerDocs)
// );
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
  })
);
// Serve the Swagger UI static assets (CSS, JS, etc.)
app.use(
  "/api-docs",
  express.static(path.join(__dirname, "node_modules/swagger-ui-dist"))
);
app.use(
  "/api-docs/swagger-ui.css",
  express.static(
    path.join(__dirname, "node_modules/swagger-ui-dist/swagger-ui.css")
  )
);
app.use(
  "/api-docs/swagger-ui-bundle.js",
  express.static(
    path.join(__dirname, "node_modules/swagger-ui-dist/swagger-ui-bundle.js")
  )
);
app.use(
  "/api-docs/swagger-ui-standalone-preset.js",
  express.static(
    path.join(
      __dirname,
      "node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js"
    )
  )
);
app.use(
  "/api-docs/swagger-ui-init.js",
  express.static(
    path.join(__dirname, "node_modules/swagger-ui-dist/swagger-ui-init.js")
  )
);

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("hello from this middleware");
  next();
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/event", eventRoute);
app.use("/api/v1/booking", bookingRoute);
app.use("/api/v1/user", userRoute);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  throw new Error("This route does not exist");
});

app.use(globalErrorHandler);

export default app;
