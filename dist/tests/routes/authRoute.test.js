"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __importDefault(require("../../App"));
const userModel_1 = __importDefault(require("../../models/userModel"));
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
const appError_1 = require("../../errors/appError");
const mockdata_1 = require("../../mockData/mockdata");
(0, dotenv_1.configDotenv)({ path: "./config.env" });
const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
    throw new appError_1.AppError("Make sure the database url is defined", 400);
}
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_1.default.deleteMany({});
}));
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(DATABASE_URL);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("ATHENTICATION ROUTE", () => {
    (0, globals_1.test)("SHOULD REGISTER NEW USER", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(App_1.default)
            .post("/api/v1/auth/register")
            .send(mockdata_1.userData);
        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({
            status: "success",
            message: "user registration successful. Kindly verify your account using the code that was sent to the email you provided.",
        });
    }));
    (0, globals_1.test)("SHOULD LOGIN REGISTERED USER", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(App_1.default).post("/api/v1/auth/register").send(mockdata_1.userData);
        const response = yield (0, supertest_1.default)(App_1.default)
            .post("/api/v1/auth/login")
            .send(mockdata_1.registeredUserData);
        expect(response.statusCode).toBe(200);
    }));
    (0, globals_1.test)("SHOULD NOT LOGIN UNREGISTERED USER", () => __awaiter(void 0, void 0, void 0, function* () {
        const unRegisteredUser = {
            email: "example@gmail.com",
            password: "ahgdgew2",
        };
        const response = yield (0, supertest_1.default)(App_1.default)
            .post("/api/v1/auth/login")
            .send(unRegisteredUser);
        expect(response.statusCode).toBe(400);
    }));
});
describe("AUTHENTICATION ROUTE: register, login and fetch user", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield userModel_1.default.deleteMany({});
    }));
    (0, globals_1.test)("SHOULD LOGIN REGISTERED USER", () => __awaiter(void 0, void 0, void 0, function* () {
        const registrationResponse = yield (0, supertest_1.default)(App_1.default)
            .post("/api/v1/auth/register")
            .send(mockdata_1.userData);
        expect(registrationResponse.statusCode).toBe(201);
        expect(registrationResponse.body).toMatchObject({
            status: "success",
            message: "user registration successful. Kindly verify your account using the code that was sent to the email you provided.",
        });
        const theuser = yield userModel_1.default.findOne({ email: mockdata_1.userData.email });
        expect(theuser).toBeTruthy();
        const verificationCode = theuser === null || theuser === void 0 ? void 0 : theuser.emailVerificationCode;
        expect(verificationCode).toBeTruthy();
        const verificationResponse = yield (0, supertest_1.default)(App_1.default)
            .patch("/api/v1/auth/verifyEmail")
            .send({
            verificationCode: verificationCode,
        });
        expect(verificationResponse.statusCode).toBe(200);
        expect(verificationResponse.body.message).toContain("You have successfully verified your email. Kindly Login again");
        expect(verificationResponse.body.status).toContain("success");
        const loginResponse = yield (0, supertest_1.default)(App_1.default)
            .post("/api/v1/auth/login")
            .send(mockdata_1.registeredUserData);
        expect(loginResponse.statusCode).toBe(200);
        expect(loginResponse.body.message).toBe("Login successful");
        expect(loginResponse.headers["set-cookie"]).toBeDefined();
        const fetchMeResponse = yield (0, supertest_1.default)(App_1.default)
            .get("/api/v1/auth/fetchMe")
            .set("Cookie", loginResponse.headers["set-cookie"]);
        expect(fetchMeResponse.statusCode).toBe(200);
        expect(fetchMeResponse.body.message).toBe("user fetched successfully");
        expect(fetchMeResponse.body.status).toBe("success");
    }));
    (0, globals_1.test)("SHOULD UPDATE USER DATA", () => __awaiter(void 0, void 0, void 0, function* () {
        //REGISTER USER
        const registerResponse = yield (0, supertest_1.default)(App_1.default)
            .post("/api/v1/auth/register")
            .send(mockdata_1.userData);
        expect(registerResponse.statusCode).toBe(201);
        //VERIFY USER EMAIL
        const signedUpUser = yield userModel_1.default.findOne({
            email: mockdata_1.registeredUserData.email,
        });
        expect(signedUpUser).toBeTruthy();
        const verificationCode = signedUpUser === null || signedUpUser === void 0 ? void 0 : signedUpUser.emailVerificationCode;
        const verifyUserResponse = yield (0, supertest_1.default)(App_1.default)
            .patch("/api/v1/auth/verifyEmail")
            .send({
            verificationCode,
        });
        expect(verifyUserResponse.statusCode).toBe(200);
        //LOGIN USER
        const loginResponse = yield (0, supertest_1.default)(App_1.default)
            .post("/api/v1/auth/login")
            .send(mockdata_1.registeredUserData);
        expect(loginResponse.statusCode).toBe(200);
        expect(loginResponse.headers["set-cookie"]).toBeDefined();
        //UPDATE USER DATA
        const cookieData = loginResponse.headers["set-cookie"];
        const updateUserResponse = yield (0, supertest_1.default)(App_1.default)
            .patch("/api/v1/auth/updateMe")
            .send({
            newEmail: "nzubechi1@gmail.com",
            newFullName: "nzube abg",
        })
            .set("Cookie", cookieData);
        expect(updateUserResponse.status).toBe(200);
        expect(updateUserResponse.body.message).toBe("User information successfully updated.");
        expect(updateUserResponse.body.status).toBe("success");
    }), 10000);
    (0, globals_1.test)("SHOULD CHANGE USER PASSWORD", () => __awaiter(void 0, void 0, void 0, function* () {
        //REGISTER USER
        const registerResponse = yield (0, supertest_1.default)(App_1.default)
            .post("/api/v1/auth/register")
            .send(mockdata_1.userData);
        expect(registerResponse.statusCode).toBe(201);
        //VERIFY USER EMAIL
        const signedUpUser = yield userModel_1.default.findOne({
            email: mockdata_1.registeredUserData.email,
        });
        expect(signedUpUser).toBeTruthy();
        const verificationCode = signedUpUser === null || signedUpUser === void 0 ? void 0 : signedUpUser.emailVerificationCode;
        const verifyUserResponse = yield (0, supertest_1.default)(App_1.default)
            .patch("/api/v1/auth/verifyEmail")
            .send({
            verificationCode,
        });
        expect(verifyUserResponse.statusCode).toBe(200);
        //LOGIN USER
        const loginResponse = yield (0, supertest_1.default)(App_1.default)
            .post("/api/v1/auth/login")
            .send(mockdata_1.registeredUserData);
        expect(loginResponse.statusCode).toBe(200);
        expect(loginResponse.headers["set-cookie"]).toBeDefined();
        //UPDATE USER PASSWORD
        const cookieData = loginResponse.headers["set-cookie"];
        const currentPassword = mockdata_1.userData.password;
        const newPassword = "abugu1";
        const confirmNewPassword = "abugu1";
        const changePasswordResponse = yield (0, supertest_1.default)(App_1.default)
            .patch("/api/v1/auth/changePassword")
            .send({
            currentPassword,
            newPassword,
            confirmNewPassword,
        })
            .set("Cookie", cookieData);
        expect(changePasswordResponse.status).toBe(200);
        expect(changePasswordResponse.body.message).toBe("password change successful.");
    }), 10000);
    (0, globals_1.test)("FORGOT PASSWORD", () => __awaiter(void 0, void 0, void 0, function* () {
        // REGISTER USER
        const registerResponse = yield (0, supertest_1.default)(App_1.default)
            .post("/api/v1/auth/register")
            .send(mockdata_1.userData);
        expect(registerResponse.status).toBe(201);
        //FORGOT PASSWORD
        const forgotPasswordResponse = yield (0, supertest_1.default)(App_1.default)
            .post("/api/v1/auth/forgotPassword")
            .send({
            email: mockdata_1.registeredUserData.email,
        });
        expect(forgotPasswordResponse.status).toBe(200);
        expect(forgotPasswordResponse.body.message).toBe("Token sent successful");
    }));
    (0, globals_1.test)("SHOULD RESET USER PASSWORD", () => __awaiter(void 0, void 0, void 0, function* () {
        // REGISTER USER
        const registerResponse = yield (0, supertest_1.default)(App_1.default)
            .post("/api/v1/auth/register")
            .send(mockdata_1.userData);
        expect(registerResponse.status).toBe(201);
        //FORGOT PASSWORD
        const forgotPasswordResponse = yield (0, supertest_1.default)(App_1.default)
            .post("/api/v1/auth/forgotPassword")
            .send({
            email: mockdata_1.registeredUserData.email,
        });
        //FIND THE USERS DATA
        const updatedUser = yield userModel_1.default.findOne({ email: mockdata_1.registeredUserData.email });
        const resetToken = updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.createResetPasswordToken();
        yield updatedUser.save({ validateBeforeSave: false });
        //RESET USER PASSWORD
        const password = "thenewpassword";
        const confirmPassword = "thenewpassword";
        const resetPasswordResponse = yield (0, supertest_1.default)(App_1.default)
            .patch(`/api/v1/auth/resetPassword/${resetToken}`)
            .send({
            password,
            confirmPassword,
        });
        expect(resetPasswordResponse.status).toBe(200);
        expect(resetPasswordResponse.body.message).toBe("You have successfully reset your password. Kindly Login again");
    }), 10000);
});
