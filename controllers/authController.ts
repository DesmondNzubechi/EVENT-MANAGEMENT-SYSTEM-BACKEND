import User from "../models/userModel";
import { Response, Request, NextFunction, CookieOptions } from "express";
import catchAsync from "../utils/catchAsync";
import { AppError } from "../errors/appError";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { verifyUserAndGetUser } from "../utils/verifyTokenAndGetUser";

config({ path: "./config.env" });

const { JWT_EXPIRES_IN, JWT_SECRET, JWT_COOKIE_EXPIRES } = process.env;

if (!JWT_EXPIRES_IN || !JWT_SECRET || !JWT_COOKIE_EXPIRES) {
  throw new AppError(
    "Kindly make sure that these env variable are defined",
    400
  );
}

const signInToken = async (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const createAndSendTokenToUser = async (
  user: any,
  statusCode: number,
  message: string,
  res: Response
) => {
  const token = await signInToken(user._id);

  const theCookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() + parseInt(JWT_COOKIE_EXPIRES, 10) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };

  res.cookie("jwt", token, theCookieOptions);

  res.status(statusCode).json({
    status: "success",
    message,
    data: {
      user,
    },
  });
};

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
      message: "user registration successful. Kindly login",
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

    createAndSendTokenToUser(user, 200, "Login successful", res);
  }
);


//FETCH AUTHENTICATED USER INFORMATION

export const fetchMe = catchAsync(async(req, res, next) => {

  const token = req.cookies.jwt;

  if(!token){
    return next(new AppError("You are not authorised to access this route", 400))
  }

  const user = await verifyUserAndGetUser(token, next);

  res.status(200).json({
    status: "success",
    message : "user fetched successfully",
    data: {
      user
    }
  })

})



export const protectedRoute = catchAsync(async(req, res, next) => {

  const token = req.cookies.jwt;

  if(!token){
    return next(new AppError("You are not authorized to access this route", 400))
  }

  const user = await verifyUserAndGetUser(token, next);

  if(!user){
    return next(new AppError("User with this token does not exist or already expired", 400))
  }

next();

})