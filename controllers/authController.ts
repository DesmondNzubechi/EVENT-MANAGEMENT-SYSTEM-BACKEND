import User from "../models/userModel";
import { Response, Request, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import { AppError } from "../errors/appError";

export const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return next(new AppError("Kindly fill in the required field", 400));
    }

    const user = await User.create({
      fullName,
      email,
      password,
      confirmPassword,
    });

    res.status(201).json({
      status: "success",
      message: "user registration successful",
      data: {
        user,
      },
    });
  }
);

export const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || (await user.correctPassword(password, user.password))) {
      return next(
        new AppError("invalid email or password. Kindly try again", 400)
      );
    }
    res.status(200).json({
      status: "success",
      message: "login successful",
      data: {
        user,
      },
    });
  }
);
