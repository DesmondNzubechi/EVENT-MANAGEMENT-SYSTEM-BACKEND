import User from "../models/userModel";
import { Response, Request, NextFunction, CookieOptions } from "express";
import catchAsync from "../utils/catchAsync";
import { AppError } from "../errors/appError";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { verifyUserAndGetUser } from "../utils/verifyTokenAndGetUser";
import { sendEmail } from "../utils/sendEmail";

config({ path: "./config.env" });

const { JWT_EXPIRES_IN, JWT_SECRET, JWT_COOKIE_EXPIRES, ORIGIN_URL } =
  process.env;

if (!JWT_EXPIRES_IN || !JWT_SECRET || !JWT_COOKIE_EXPIRES || !ORIGIN_URL) {
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

//LOGIN USER
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
export const fetchMe = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(
      new AppError("You are not authorised to access this route", 400)
    );
  }

  const user = await verifyUserAndGetUser(token, next);

  res.status(200).json({
    status: "success",
    message: "user fetched successfully",
    data: {
      user,
    },
  });
});

export const protectedRoute = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(
      new AppError("You are not authorized to access this route", 400)
    );
  }

  const user = await verifyUserAndGetUser(token, next);

  if (!user) {
    return next(
      new AppError(
        "User with this token does not exist or  token already expired",
        400
      )
    );
  }

  next();
});

export const updateMe = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(
      new AppError("You are not authorized to perform this action.", 401)
    );
  }

  const user = await verifyUserAndGetUser(token, next);

  if (!user) {
    return next(
      new AppError(
        "Could not find user with this token. please login again.",
        404
      )
    );
  }

  const { email, fullName } = req.body;

  if (!email || !fullName) {
    return next(new AppError("Kindly provide the required field", 400));
  }

  const updateUser = await User.findByIdAndUpdate(
    user.id,
    { email, fullName },
    {
      runValidators: true,
      new: true,
    }
  );

  if (!updateMe) {
    return next(
      new AppError("Could not update user info. Please try again", 400)
    );
  }

  res.status(200).json({
    status: "success",
    message: "User information successfully updated",
    data: {
      user: updateUser,
    },
  });
});

export const changeUserPassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new AppError("Please provide the required field", 400));
  }

  if (newPassword !== confirmNewPassword) {
    return next(
      new AppError("new password and confirm password must be the same.", 400)
    );
  }

  const token = req.cookies.jwt;

  if (!token) {
    return next(
      new AppError("You are not authorized to perform this action.", 401)
    );
  }

  const user = await verifyUserAndGetUser(token, next);

  if (!user) {
    return next(
      new AppError(
        "Could not fetch user with the token. Kindly login again.",
        404
      )
    );
  }

  const correctP = await user.correctPassword(currentPassword, user.password);

  if (!correctP) {
    return next(
      new AppError(
        "The password you provided is not the same with your current password. Please try agian",
        400
      )
    );
  }

  user.password = newPassword;
  user.confirmPassword = confirmNewPassword;
  await user.save();

  createAndSendTokenToUser(user, 200, "password change successful.", res);
});

export const forgottPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("User does not exist with this email.", 404));
  }

  const resetToken = user.createResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${ORIGIN_URL}/reset-password/${resetToken}`;

  const message = `forgot your password? kindly reset your password using ${resetUrl}. If you did not request for this kindly ignore. This is only valid for 30 minutes`;

  try {
    sendEmail({
      message,
      subject: "RESET PASSWORD URL",
      email: user.email,
      name: user.fullName,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent successful",
    });
  } catch (error) {
    return next(
      new AppError(
        "An error occured while sending email. Please try again",
        400
      )
    );
  }
});