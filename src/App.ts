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
const app = express();
// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, // Allow credentials (cookies)
  methods: 'GET,POST,DELETE,PATCH',
  allowedHeaders: 'Content-Type, Authorization, api_key',
};

// Use CORS middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(cookieParser());

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("THIS API IS WORKING AS EXPECTED");
});

export const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "EVENT BOOKING PLATFORM API",
      version: "1.0.0",
      description: `
      `,
    },
    servers: [
      {
        url: process.env.backendUrl,
      },
    ],
    components: {
      schemas: {
        Auth: {},
        Event: {},
        Booking: {},
        User: {},
      },
    },
  },
  apis: ["./routes/*.ts"], // Path to your route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use(
  "/api-docs",
  express.static("node_modules/swagger-ui-dist/", { index: false }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs)
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
