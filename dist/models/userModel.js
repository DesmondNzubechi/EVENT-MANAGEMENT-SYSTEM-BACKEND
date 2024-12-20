"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const { model, Schema } = mongoose_1.default;
const crypto_1 = __importDefault(require("crypto"));
const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "Please provide your fullname"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email address"],
        unique: true,
        validate: [validator_1.default.isEmail, "Kindly provide a valid email"],
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "user", "super-admin"],
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
            validator: function (confirmP) {
                return confirmP === this.password;
            },
            message: "Password and confirm password must be the same.",
        },
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    emailVerificationCode: Number,
    emailVerificationCodeExpires: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        this.password = yield bcryptjs_1.default.hash(this.password, 12);
        this.confirmPassword = undefined;
        next();
    });
});
userSchema.methods.correctPassword = (userPassword, originalPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.compare(userPassword, originalPassword);
});
//CHANGE PASSWORD AFTER
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangeAt) {
        const jwtTimestamp = typeof JWTTimestamp === "string"
            ? parseInt(JWTTimestamp, 10)
            : JWTTimestamp;
        const changeTimestamp = this.passwordChangeAt.getTime() / 1000;
        return jwtTimestamp < changeTimestamp;
    }
    return false;
};
userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetTokenExpires = Date.now() + 30 * 60 * 1000;
    return resetToken;
};
const User = mongoose_1.models.users || model("users", userSchema);
exports.default = User;
