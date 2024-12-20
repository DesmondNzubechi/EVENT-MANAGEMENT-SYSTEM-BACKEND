"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenAndGetUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const appError_1 = require("../errors/appError");
const userModel_1 = __importDefault(require("../models/userModel"));
(0, dotenv_1.config)({ path: "./config.env" });
const { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
    throw new appError_1.AppError("make sure the environmental variable is defined", 400);
}
const verifyTokenAndGetUser = (token, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = yield new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
                if (err)
                    reject(new appError_1.AppError("Token Verication Failed", 400));
                else
                    resolve(decoded);
            });
        });
        const user = yield userModel_1.default.findById(decoded.id);
        if (!user) {
            return next(new appError_1.AppError("User not found with this id", 404));
        }
        if (user.changePasswordAfter(decoded.iat)) {
            return next(new appError_1.AppError("user recently changed password. please login again", 400));
        }
        return user;
    }
    catch (error) {
        console.log(error);
        return next(new appError_1.AppError("Authentication failed", 401));
    }
});
exports.verifyTokenAndGetUser = verifyTokenAndGetUser;
