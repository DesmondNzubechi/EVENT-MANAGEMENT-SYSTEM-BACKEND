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
exports.sendEventBookingEmail = void 0;
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
const sendEventBookingEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
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
      /* Email container styling */
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #4CAF50;
        color: white;
        padding: 10px;
        text-align: center;
      }
      .header img {
        max-width: 120px;
        margin-bottom: 10px;
      }
      .content {
        padding: 20px;
      }
      .content h2 {
        color: #4CAF50;
      }
      .info-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      .info-table th, .info-table td {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        text-align: left;
      }
      .info-table th {
        background-color: #f4f4f4;
        color: #333;
      }
      .footer {
        padding: 20px;
        text-align: center;
        color: #777;
        font-size: 12px;
        background-color: #f4f4f4;
      }
      .button {
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        text-align: center;
        display: inline-block;
        border-radius: 5px;
        text-decoration: none;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <!-- Header section -->
      <div class="header">
      <h1>THE UEVENT MANAGEMENT</h1>
       <!-- <img src="https://www.dexdigit.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FDexDigit.c9d87694.png&w=128&q=75" alt="Company Logo" /> -->
        <h1>Payment Confirmation</h1>
      </div>

      <!-- Content section -->
      <div class="content">
        <h2>Hello, ${options.fullName}!</h2>
        <p>${options.message}</p>

        <!-- Event information -->
        <table class="info-table">
          <tr>
            <th>Event Name</th>
            <td>${options.title}</td>
          </tr>
          <tr>
            <th>Ticket Price</th>
            <td>N${options.price}</td>
          </tr>
          <tr>
            <th>Event Date</th>
            <td>${options.date}</td>
          </tr>
          <tr>
            <th>Event Location</th>
            <td>${options.location}</td>
          </tr>
           <tr>
            <th>Payment Status</th>
            <td>${options.paymentStatus}</td>
          </tr>
         ${options.ticketNumber
            ? ` <tr>
            <th>Ticket No.</th>
            <td>${options.ticketNumber}</td>
          </tr>`
            : ""}
          <tr>
            <th>Time Booked</th>
            <td>${new Date().toLocaleString()}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>${options.email}</td>
          </tr>
        </table>

        <!-- Download link -->
        <p>
       <a href="${options.link}" class="button" download>${options.linkName}</a>
        </p>
      </div>

      <!-- Footer section -->
      <div class="footer">
        <p>The Uevent | Enugu, Nigeria | nzubechukwu@gmail.com</p>
        <p>&copy; 2024 The Uevent. All rights reserved.</p>
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
exports.sendEventBookingEmail = sendEventBookingEmail;
