import app from "../../App";
import User from "../../models/userModel";
import { test } from '@jest/globals'
import request from "supertest"

import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import { AppError } from "../../errors/appError";

configDotenv({ path: "./config.env" });

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new AppError("Make sure the database url is defined", 400);
}

beforeAll(async () => {
  await mongoose.connect(DATABASE_URL);
});

beforeEach(async () => {
    await User.deleteMany({}) 
}) 
 
afterAll(async () => {
  await mongoose.connection.close();
}); 

 

describe("ATHENTICATION ROUTE", () => {

    it("TEST THE REGISTRATION ROUTE", async () => {
        const user = {
            fullName: "Desmond Abugu",
            email: "abugu@gmail.com",
            password: "123456789",
            confirmPassword : "123456789"
        }

        const response = await request(app).post("/api/v1/auth/register").send(user)
console.log("This is the mumu error", response.body) 
        expect(response.statusCode).toBe(201)  
    })
  
}) 