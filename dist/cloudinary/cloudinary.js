"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)({ path: './config.env' });
//CONFIGURATION OF CLOUDINARY USING THE REQUIRED CREDENTIAL
const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUD_NAME } = process.env;
cloudinary_1.v2.config({
    secure: true,
    cloud_name: CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});
exports.default = cloudinary_1.v2;
