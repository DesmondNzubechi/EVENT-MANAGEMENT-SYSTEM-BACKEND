import mongoose from "mongoose";

export interface userType {
  fullName: string;
  email: string;
  password: string;
  id: mongoose.ObjectId
  confirmPassword: string | undefined;
  correctPassword(
    userPassword: string,
    originalPassword: string
  ): Promise<boolean>;
}
