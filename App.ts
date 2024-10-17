import express, { Response, Request, NextFunction } from "express";
import globalErrorHandler from "./errors/errorController";
import authRoute from "../EVENT MANAGEMENT - BACKEND/routes/authRoute";
import eventRoute from "../EVENT MANAGEMENT - BACKEND/routes/eventRoute";
const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("THIS API IS WORKING AS EXPECTED");
});

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("hello from this middleware");
  next();
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  throw new Error("This route does not exist");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/event", eventRoute);

app.use(globalErrorHandler);

export default app;
