import mongoose from "mongoose";
import { userType } from "../types/types";
import validator from "validator";
import bcryptjs from "bcryptjs";
const { model, Schema } = mongoose;
import crypto from "crypto";

const userSchema = new Schema<userType>({
  fullName: {
    type: String,
    required: [true, "Please provide your fullname"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email address"],
    unique: true,
    validate: [validator.isEmail, "Kindly provide a valid email"],
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Kindly provide your password"],
  },
  confirmPassword: {
    type: String,
    required: [true, "Kindly confirm your password"],
    validate: {
      validator: function (confirmP: string) {
        return confirmP === this.password;
      },
      message: "Password and confirm password must be the same.",
    },
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationCode:Number,
  emailVerificationCodeExpires: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date, 
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcryptjs.hash(this.password, 12);

this.confirmPassword = undefined

next()
});


userSchema.methods.correctPassword = async (
  userPassword: string,
  originalPassword: string
) => {
  return await bcryptjs.compare(userPassword, originalPassword);
};
 

//CHANGE PASSWORD AFTER
userSchema.methods.changePasswordAfter = function (
  JWTTimestamp: string | number
): boolean {
  if (this.passwordChangeAt) {
    const jwtTimestamp =
      typeof JWTTimestamp === "string"
        ? parseInt(JWTTimestamp, 10)
        : JWTTimestamp;

    const changeTimestamp = this.passwordChangeAt.getTime() / 1000;

    return jwtTimestamp < changeTimestamp;
  }

  return false;
};

userSchema.methods.createResetPasswordToken = async function () {
  const resetToken = await crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpires = Date.now() + 30 * 60 * 1000;

  return resetToken;
};


const User = model("users", userSchema);

export default User;
