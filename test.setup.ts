import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import { AppError } from "./errors/appError";

configDotenv({ path: "./config.env" });

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new AppError("Make sure the database url is defined", 400);
}

beforeAll(async () => {
  await mongoose.connect(DATABASE_URL);
}, 20000);


afterAll(async () => {
  await mongoose.connection.close();
}, 20000); 
