import mongoose, { Date } from "mongoose";

export interface userType {
  fullName: string;
  email: string;
  password: string;
  role: string;
  id: mongoose.ObjectId;
  confirmPassword: string | undefined;
  correctPassword(
    userPassword: string,
    originalPassword: string
  ): Promise<boolean>;
  changePasswordAfter(JWTTimestamp: string): boolean;
  createResetPasswordToken(): string;
  passwordChangeAt?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  emailVerificationCode?: number | null
  emailVerificationCodeExpires?: Date | unknown | any
  emailVerified : boolean
}

export interface eventType {
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  date: string;
  price: number;
  location: string;
  status: string;
  totalTicket: number;
  availableTicket: number;
  bookedTicket : number;
  bookieEmail: string[];
  bookieId : mongoose.ObjectId[]
} 

export interface bookingType {
  
}
