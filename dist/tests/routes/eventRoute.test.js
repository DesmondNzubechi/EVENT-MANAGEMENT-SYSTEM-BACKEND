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
const dotenv_1 = require("dotenv");
const appError_1 = require("../../errors/appError");
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../../models/userModel"));
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const mockdata_1 = require("../../mockData/mockdata");
(0, dotenv_1.configDotenv)({ path: "./config.env" });
const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
    throw new appError_1.AppError("Make sure the database url is defined", 400);
}
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(DATABASE_URL);
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_1.default.deleteMany({});
}));
// afterEach(async () => {
//     await User.deleteMany({})
//   });
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe('TESTING THE EVENT ROUTES', () => {
    (0, globals_1.it)("SHOULD TEST THAT ORDINARY USER CAN NOT CREATE EVENT", () => __awaiter(void 0, void 0, void 0, function* () {
        //REGISTER USER
        const registerUserResponse = yield (0, supertest_1.default)(App_1.default).post("/api/v1/auth/register").send(mockdata_1.userData);
        console.log("THE EVENT ROUTE RESPONSE", registerUserResponse.body);
        expect(registerUserResponse.status).toBe(201);
        console.log("THE EVENT ROUTE RESPONSE", registerUserResponse.body);
        //VERIFY USER EMAIL
        const user = yield userModel_1.default.findOne({ email: mockdata_1.registeredUserData.email });
        expect(user).toBeTruthy();
        // await new Promise(resolve => setTimeout(resolve, 1000));
        const verificationCode = user === null || user === void 0 ? void 0 : user.emailVerificationCode;
        expect(verificationCode).toBeTruthy();
        const verificationResponse = yield (0, supertest_1.default)(App_1.default).patch("/api/v1/auth/verifyEmail").send({ verificationCode });
        console.log("THE VERIFICATION RESPONSE", verificationResponse.body);
        expect(verificationResponse.status).toBe(200);
        const loginResponse = yield (0, supertest_1.default)(App_1.default).post("/api/v1/auth/login").send(mockdata_1.registeredUserData);
        console.log("THE LOGIN EVENT ROUTE RESPONSE", loginResponse.body);
        expect(loginResponse.status).toBe(200);
        const createEventResponse = yield (0, supertest_1.default)(App_1.default).post("/api/v1/event/createEvent").send(mockdata_1.eventData);
        console.log("THE CREATE EVENT ROUTE RESPONSE", createEventResponse.body);
        expect(createEventResponse.status).toBe(401);
        console.log("THE EVENT ROUTE RESPONSE", createEventResponse.body);
    }), 50000);
});
