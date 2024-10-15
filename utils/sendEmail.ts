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

        const mailOptions = {
            to: options.email,
            from : EMAIL_FROM,
            subject: options.subject,
            name : options.name,
            message: options.message
        }

        await transporter.sendMail(mailOptions)

        console.log("successful")
    } catch (error) {
        throw new AppError("An error occured. could you please try again", 400)
    }

}


