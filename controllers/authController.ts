import User from "../models/userModel";
import { Response, Request, NextFunction, CookieOptions } from "express";
import catchAsync from "../utils/catchAsync";
import { AppError } from "../errors/appError";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { verifyTokenAndGetUser } from "../utils/verifyTokenAndGetUser";
import { sendEmail } from "../utils/sendEmail";
import crypto from "crypto";
import { AppResponse } from "../utils/appResponse";
import { generatEmailVerificationCode } from "../utils/emailVerificationCode";

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

    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return next(
        new AppError(
          "User already exist with this email. If you are the one kindly login.",
          400
        )
      );
    }

    if (!fullName || !email || !password || !confirmPassword) {
      return next(new AppError("Kindly fill in the required field", 400));
    }

    const user = await User.create({
      fullName,
      email,
      password,
      confirmPassword,
    });

    const verificationCode = await generatEmailVerificationCode();
    const verificationMessage =
      "Thank you for signing up for The Uevent! To start booking your favorite events, please verify your email using the verification code below. Note: This code will expire in 30 minutes.";

    user.emailVerificationCode = verificationCode;
    user.emailVerificationCodeExpires = Date.now() + 30 * 60 * 1000;

    await user.save();

    sendEmail({
      name: user.fullName,
      email: user.email,
      subject: "VERIFY YOUR EMAIL",
      message: verificationMessage,
      vCode: verificationCode,
      link: ORIGIN_URL,
      linkName: "Visit our website",
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

    const user = await User.findOne({ email: email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(
        new AppError("invalid email or password. Kindly try again", 400)
      );
    }

    if (!user.emailVerified) {
      const verificationCode = await generatEmailVerificationCode();
      const verificationMessage =
        "You haven't verified your email since signing up for The Uevent. Please verify your email using the code below to start booking your favorite events. Note, the code expires in 30 minutes.";

      user.emailVerificationCode = verificationCode;
      user.emailVerificationCodeExpires = Date.now() + 30 * 60 * 1000;

      await user.save({ validateBeforeSave: false });

      sendEmail({
        name: user.fullName,
        email: user.email,
        subject: "VERIFY YOUR EMAIL",
        message: verificationMessage,
        vCode: verificationCode,
        link: ORIGIN_URL,
        linkName: "Visit our website",
      });
    }

    if (user.emailVerified) {
      createAndSendTokenToUser(user, 200, "Login successful", res);
    } else {
      return AppResponse(
        res,
        200,
        "success",
        "Login successful. Kindly verify your email to access your dashboard",
        user.id
      );
    }

  }
);



//FETCH AUTHENTICATED USER INFORMATION
export const fetchMe = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(
      new AppError("You are not authorised to access this route", 401)
    );
  }

  const user = await verifyTokenAndGetUser(token, next);

  if (!user) {
    return next(new AppError("An error occured. Please try again", 400));
  }

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
      new AppError("You are not authorized to access this route", 401)
    );
  }

  const user = await verifyTokenAndGetUser(token, next);

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

  const user = await verifyTokenAndGetUser(token, next);

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

  const user = await verifyTokenAndGetUser(token, next);

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

  const message = `forgot your password? kindly reset your password by clicking the link below. If you did not request for this kindly ignore. This is only valid for 30 minutes.`;

  try {
    sendEmail({
      message,
      subject: "RESET PASSWORD Link",
      email: user.email,
      name: user.fullName,
      link: resetUrl,
      linkName: "Reset Password",
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










export const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  const decodedToken = await crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: decodedToken,
    passwordresetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("This token is invalid or already expired", 400));
  }

  const { password, confirmPassword } = req.body;

  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetTokenExpires = undefined;
  user.passwordResetToken = undefined;

  await user.save();

  sendEmail({
    message:
      "You have successfully reset your password. Kindly login back using the link below",
    subject: "PASSWORD RESET SUCCESSFUL",
    email: user.email,
    name: user.fullName,
    link: ORIGIN_URL,
    linkName: "Login",
  });

  return AppResponse(
    res,
    200,
    "success",
    "You have successfully reset your password. Kindly Login again",
    null
  );
});





export const sendVerificationCode = catchAsync(async (req, res, next) => {
  
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("User does not exist", 404));
  }

  if (user.emailVerified) {
    return next(new AppError("User email already verified. Kindly login", 400));
  }



})



export const verifyUserEmail = catchAsync(async (req, res, next) => {
  const { verificationCode } = req.body;

  if (!verificationCode) {
    return next(
      new AppError(
        "Kindly provide the verification code sent to your email.",
        400
      )
    );
  }

  const user = await User.findOne({ emailVerificationCode: verificationCode });

  if (!user) {
    return next(
      new AppError(
        "Wrong verification code or if you did not get any code try resending it.",
        400
      )
    );
  }

  if (user.emailVerified) {
    return next(
      new AppError(
        "User Email already verified. Kindly proceed to login.",
        400
      )
    );
  }


  if (user.emailVerificationCodeExpires < Date.now()) {
    return next(
      new AppError("Verification code expired. Kindly send another one.", 400)
    );
  }

  user.emailVerificationCode = null;
  (user.emailVerificationCodeExpires = null), (user.emailVerified = true);

  await user.save({ validateBeforeSave: false });

    const verificationMessage =
      "You have successfully verified your email. You can now proceed to login";


    sendEmail({
      name: user.fullName,
      email: user.email,
      subject: "EMAIL VERIFICATION SUCCESSFUL",
      message: verificationMessage,
      vCode: verificationCode,
      link: `${ORIGIN_URL}/login`,
      linkName: "Login Here",
    });


  return AppResponse(
    res,
    200,
    "success",
    "You have successfully verified your email. Kindly Login again",
    null
  );
});











export const logoutUser = catchAsync(async (req, res, next) => {
  const CookieOptions = {
    secure: true,
    httpOnly: true,
    sammeSite: "none" as "none",
    expires: new Date(Date.now() + 1 * 1000),
  };

  res.cookie("jwt", "logout", CookieOptions);

  res.status(200).json({
    status: "success",
    message: "Logout successful",
  });
});
