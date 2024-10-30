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

    const fetchMeResponse = await request(app)
      .get("/api/v1/auth/fetchMe")
      .set("Cookie", loginResponse.headers["set-cookie"]);
    console.log("fetch me response", fetchMeResponse.body);

    expect(fetchMeResponse.statusCode).toBe(200);
    expect(fetchMeResponse.body.message).toBe("user fetched successfully");
    expect(fetchMeResponse.body.status).toBe("success");
  });

  test("SHOULD UPDATE USER DATA", async () => {
    //REGISTER USER
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send(userData);
    expect(registerResponse.statusCode).toBe(201);

    //VERIFY USER EMAIL
    const signedUpUser = await User.findOne({
      email: registeredUserData.email,
    });
    expect(signedUpUser).toBeTruthy();

    const verificationCode = signedUpUser?.emailVerificationCode;

    const verifyUserResponse = await request(app)
      .patch("/api/v1/auth/verifyEmail")
      .send({
        verificationCode,
      });
    expect(verifyUserResponse.statusCode).toBe(200);

    //LOGIN USER
    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send(registeredUserData);
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.headers["set-cookie"]).toBeDefined();

    //UPDATE USER DATA
    const cookieData = loginResponse.headers["set-cookie"];
    const updateUserResponse = await request(app)
      .patch("/api/v1/auth/updateMe")
      .send({
        newEmail: "nzubechi1@gmail.com",
        newFullName: "nzube abg",
      })
      .set("Cookie", cookieData);
    expect(updateUserResponse.status).toBe(200);
    expect(updateUserResponse.body.message).toBe(
      "User information successfully updated."
    );
    expect(updateUserResponse.body.status).toBe("success");
  }, 10000);

  test("SHOULD CHANGE USER PASSWORD", async () => {
    //REGISTER USER
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send(userData);
    expect(registerResponse.statusCode).toBe(201);

    //VERIFY USER EMAIL
    const signedUpUser = await User.findOne({
      email: registeredUserData.email,
    });
    expect(signedUpUser).toBeTruthy();

    const verificationCode = signedUpUser?.emailVerificationCode;

    const verifyUserResponse = await request(app)
      .patch("/api/v1/auth/verifyEmail")
      .send({
        verificationCode,
      });
    expect(verifyUserResponse.statusCode).toBe(200);

    //LOGIN USER
    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send(registeredUserData);
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.headers["set-cookie"]).toBeDefined();

    //UPDATE USER PASSWORD
    const cookieData = loginResponse.headers["set-cookie"];
    const currentPassword = userData.password;
    const newPassword = "abugu1";
    const confirmNewPassword = "abugu1";
    const changePasswordResponse = await request(app)
      .patch("/api/v1/auth/changePassword")
      .send({
        currentPassword,
        newPassword,
        confirmNewPassword,
      })
      .set("Cookie", cookieData);
    expect(changePasswordResponse.status).toBe(200);
    expect(changePasswordResponse.body.message).toBe(
      "password change successful."
    );
  }, 10000);

  test("FORGOT PASSWORD", async () => {
    // REGISTER USER
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send(userData);
    expect(registerResponse.status).toBe(201);

    //FORGOT PASSWORD
    const forgotPasswordResponse = await request(app)
      .post("/api/v1/auth/forgotPassword")
      .send({
        email: registeredUserData.email,
      });

    expect(forgotPasswordResponse.status).toBe(200);
    expect(forgotPasswordResponse.body.message).toBe("Token sent successful");
  });

  test("RESET USER PASSWORD", async () => {
    // REGISTER USER
    const registerResponse = await request(app)
      .post("/api/v1/auth/register")
      .send(userData);
    expect(registerResponse.status).toBe(201);

    //FORGOT PASSWORD
    const forgotPasswordResponse = await request(app)
      .post("/api/v1/auth/forgotPassword")
      .send({
        email: registeredUserData.email,
      });

    //FIND THE USERS DATA
    const updatedUser = await User.findOne({ email: registeredUserData.email });
    const resetToken = updatedUser?.createResetPasswordToken();
    await updatedUser!.save({ validateBeforeSave: false });

    //RESET USER PASSWORD
    const password = "thenewpassword";
    const confirmPassword = "thenewpassword";
    const resetPasswordResponse = await request(app)
      .patch(`/api/v1/auth/resetPassword/${resetToken}`)
      .send({
        password,
        confirmPassword,
      });

    expect(resetPasswordResponse.status).toBe(200);
    expect(resetPasswordResponse.body.message).toBe(
      "You have successfully reset your password. Kindly Login again"
    );
  }, 10000);
});
