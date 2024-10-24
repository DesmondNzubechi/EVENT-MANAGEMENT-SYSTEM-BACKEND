import nodemailer from 'nodemailer'
import { AppError } from '../errors/appError'
import { configDotenv } from 'dotenv'
import catchAsync from './catchAsync';

configDotenv({path : "./config.env"});

const { EMAIL_HOST, EMAIL_PORT, EMAIL_PASSWORD, EMAIL_USERNAME, EMAIL_FROM } = process.env;

if(!EMAIL_HOST || !EMAIL_PORT || !EMAIL_PASSWORD || !EMAIL_USERNAME || !EMAIL_FROM) {
    throw new AppError("Please make sure that these environmental variables exist", 400)
}


export const sendEmail = async (options : any) => {

    try {
        const transporter = nodemailer.createTransport({
            host : EMAIL_HOST,
            port : Number(EMAIL_PORT),
            secure : true,
            auth : {
                user : EMAIL_USERNAME,
                pass : EMAIL_PASSWORD
            }
        })

        const emailTemplate = `
        <html>
          <head>
            <style>
              /* Some basic inline styles for email */
              body { font-family: Arial, sans-serif; color: #333; }
              .email-container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; padding: 10px; background-color: #f4f4f4; }
              .header img { max-width: 150px; }
              .content { padding: 20px; background-color: #fff; border: 1px solid #ddd; }
              .footer { text-align: center; color: #777; font-size: 12px; margin-top: 20px; }
              .button { background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; display: inline-block; border-radius: 5px; text-decoration: none; }
            </style>
          </head>
          <body>
           <!--
            <div class="email-container">
              Company Logo
              <div class="header">
                <img src="https://example.com/logo.png" alt="Company Logo" />
              </div>
               -->
              <!-- Main content area -->
              <div class="content">
                <h2>Hello, ${options.name}!</h2>
                <p>${options.message}</p>
  
                <!-- Button that links somewhere -->
                <a href="https://yourcompany.com" class="button">Visit our Website</a>
              </div>
  
              <!-- Footer section -->
              <div class="footer">
                <p>Company Name | Address | Contact</p>
                <p>&copy; 2024 Your Company. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;

        const mailOptions = {
            to: options.email,
            from : EMAIL_FROM,
            subject: options.subject,
            name : options.name,
            html: emailTemplate
        }

        await transporter.sendMail(mailOptions)

        console.log("successful")
    } catch (error) {
        throw new AppError("An error occured. could you please try again", 400)
    }

}


