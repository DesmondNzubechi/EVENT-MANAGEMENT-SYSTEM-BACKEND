import app from "../../App";
import User from "../../models/userModel";
import { test } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import { AppError } from "../../errors/appError";
import { registeredUserData, userData } from "../../mockData/mockdata";

configDotenv({ path: "./config.env" });

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new AppError("Make sure the database url is defined", 400);
}

beforeAll(async () => {
  await mongoose.connect(DATABASE_URL);
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("ATHENTICATION ROUTE", () => {
  test("SHOULD REGISTER NEW USER", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(userData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      status: "success",
      message:
        "user registration successful. Kindly verify your account using the code that was sent to the email you provided.",
    });
  });

  test("SHOULD LOGIN REGISTERED USER", async () => {
    await request(app).post("/api/v1/auth/register").send(userData);

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(registeredUserData);
    console.log("the response", response.body);
    expect(response.statusCode).toBe(200);
  });

  test("SHOULD NOT LOGIN UNREGISTERED USER", async () => {
    const unRegisteredUser = {
      email: "example@gmail.com",
      password: "ahgdgew2",
    };

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(unRegisteredUser);

    expect(response.statusCode).toBe(400);
  });
});

describe("AUTHENTICATION ROUTE: register, login and fetch user", () => {
  test("SHOULD LOGIN REGISTERED USER", async () => {
    const registrationResponse = await request(app)
      .post("/api/v1/auth/register")
      .send(userData);

    expect(registrationResponse.statusCode).toBe(201);
    expect(registrationResponse.body).toMatchObject({
      status: "success",
      message:
        "user registration successful. Kindly verify your account using the code that was sent to the email you provided.",
    });

    const theuser = await User.findOne({ email: userData.email });
    expect(theuser).toBeTruthy();

    const verificationCode = theuser?.emailVerificationCode;

    expect(verificationCode).toBeTruthy();

    const verificationResponse = await request(app)
      .patch("/api/v1/auth/verifyEmail")
      .send({
        verificationCode: verificationCode,
      });

    expect(verificationResponse.statusCode).toBe(200);
    expect(verificationResponse.body.message).toContain(
      "You have successfully verified your email. Kindly Login again"
    );
    expect(verificationResponse.body.status).toContain("success");

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send(registeredUserData);

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.message).toBe("Login successful");
    expect(loginResponse.headers["set-cookie"]).toBeDefined();

    console.log("the login response don dey here", loginResponse.headers);

    const fetchMeResponse = await request(app)
      .get("/api/v1/auth/fetchMe")
      .set("Cookie", loginResponse.headers["set-cookie"]);
    console.log("fetch me response", fetchMeResponse.body);

    expect(fetchMeResponse.statusCode).toBe(200);
    expect(fetchMeResponse.body.message).toBe("user fetched successfully");
    expect(fetchMeResponse.body.status).toBe("success");
  });
});
