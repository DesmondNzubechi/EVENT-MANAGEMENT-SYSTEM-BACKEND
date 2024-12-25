"use strict";
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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const appError_1 = require("../errors/appError");
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)({ path: "./config.env" });
const { EMAIL_HOST, EMAIL_PORT, EMAIL_PASSWORD, EMAIL_USERNAME, EMAIL_FROM } = process.env;
if (!EMAIL_HOST ||
    !EMAIL_PORT ||
    !EMAIL_PASSWORD ||
    !EMAIL_USERNAME ||
    !EMAIL_FROM) {
    throw new appError_1.AppError("Please make sure that these environmental variables exist", 400);
}
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: EMAIL_HOST,
            port: Number(EMAIL_PORT),
            secure: true,
            auth: {
                user: EMAIL_USERNAME,
                pass: EMAIL_PASSWORD,
            },
        });
        const emailTemplate = `
        <html>
          <head>
            <style>
              /* Basic reset */
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: Arial, sans-serif;
                background-color: #f7f7f7;
                color: #333;
                line-height: 1.6;
              }
              .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                overflow: hidden;
              }
              .header {
                background-color: #1e88e5;
                color: #ffffff;
                text-align: center;
                padding: 20px;
              }
              .header img {
                max-width: 150px;
                margin-bottom: 10px;
              }
              .header h1 {
                font-size: 24px;
                margin-bottom: 10px;
              }
              .content {
                padding: 20px;
              }
              .content h2 {
                font-size: 20px;
                color: #1e88e5;
                margin-bottom: 15px;
              }
              .content p {
                font-size: 16px;
                margin-bottom: 20px;
                color: #555;
              }
              .code {
                font-size: 24px;
                color: #1e88e5;
                margin: 20px 0;
                text-align: center;
              }
              .button {
                display: inline-block;
                background-color: #1e88e5;
                color: #ffffff;
                padding: 12px 20px;
                text-align: center;
                border-radius: 5px;
                text-decoration: none;
                font-size: 16px;
                margin: 20px 0;
                width: 100%;
              }
              .button:hover {
                background-color: #1565c0;
              }
              .footer {
                background-color: #f4f4f4;
                text-align: center;
                padding: 20px;
                font-size: 12px;
                color: #777;
              }
              .footer p {
                margin: 5px 0;
              }
              /* Responsive */
              @media (max-width: 600px) {
                .email-container {
                  width: 100%;
                }
                .content, .header, .footer {
                  padding: 15px;
                }
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <!-- Header Section with Logo and Company Name -->
              <div class="header">
                <h1>The Uevents</h1>
              </div>
        
              <!-- Main Content Area -->
              <div class="content">
                <h2>Hello, ${options.name}!</h2>
                <p>${options.message}</p>
        
                <!-- Action Button -->
                <a href="${options.link}" class="button">${options.linkName}</a>
              </div>
        
              <!-- Footer Section -->
              <div class="footer">
                <p>The Uevent | Enugu, Nigeria | nzubechukwu@gmail.com</p>
                <p>&copy; 2024 The Uevents. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
        `;
        const mailOptions = {
            to: options.email,
            from: EMAIL_FROM,
            subject: options.subject,
            name: options.name,
            html: emailTemplate,
        };
        yield transporter.sendMail(mailOptions);
        console.log("successful");
    }
    catch (error) {
        throw new appError_1.AppError("An error occured. could you please try again", 400);
    }
});
exports.sendEmail = sendEmail;
