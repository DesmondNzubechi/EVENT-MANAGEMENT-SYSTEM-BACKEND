import mongoose from "mongoose";
import { userType } from "../types/types";
import validator from "validator";
import bcryptjs from "bcryptjs";
const { model, Schema } = mongoose;

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
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) return next();

  this.password = await bcryptjs.hash(this.password, 12);

  return (this.confirmPassword = undefined);
});

userSchema.methods.correctPassword = async (
  userPassword: string,
  originalPassword: string
) => {
  return await bcryptjs.compare(userPassword, originalPassword);
};

const User = model("users", userSchema);

export default User;
