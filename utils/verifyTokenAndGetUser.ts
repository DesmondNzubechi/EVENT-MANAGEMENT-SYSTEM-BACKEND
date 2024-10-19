import jwt, { decode } from "jsonwebtoken";
import { NextFunction } from "express";
import { config } from "dotenv";
import { AppError } from "../errors/appError";
import User from "../models/userModel";

config({ path: "./config.env" });

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new AppError("make sure the environmental variable is defined", 400);
}

export const verifyTokenAndGetUser = async (
  token: string,
  next: NextFunction
) => {
  try {
    const decoded: any = await new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
        if (err) reject(new AppError("Token Verication Failed", 400));
        else resolve(decoded);
      });
    });

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError("User not found with this id", 404));
    }

    if (user.changePasswordAfter(decoded.iat)) {
      return next(
        new AppError("user recently changed password. please login again", 400)
      );
    }

    return user;
  } catch (error) {
    console.log(error);

    return next(new AppError("Authentication failed", 401));
  }
};
