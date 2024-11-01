import app from "../../App";
import { configDotenv } from "dotenv";
import { AppError } from "../../errors/appError";
import mongoose from "mongoose";
import User from "../../models/userModel";
import { it } from '@jest/globals';
import request from 'supertest';
import { eventData, registeredUserData, userData } from "../../mockData/mockdata";

configDotenv({ path: "./config.env" });

const {DATABASE_URL } = process.env


if (!DATABASE_URL) {
    throw new AppError("Make sure the database url is defined", 400);
  }

beforeAll(async () => {

    await mongoose.connect(DATABASE_URL)

})

beforeEach(async () => {
    await User.deleteMany({})
})

// afterEach(async () => {
//     await User.deleteMany({})
//   });

afterAll(async () => {
   await mongoose.connection.close()
})


      

describe('TESTING THE EVENT ROUTES', () => {

    it("SHOULD TEST THAT ORDINARY USER CAN NOT CREATE EVENT", async () => {
 
        //REGISTER USER
        const registerUserResponse = await request(app).post("/api/v1/auth/register").send(userData);
        console.log("THE EVENT ROUTE RESPONSE", registerUserResponse.body)
        expect(registerUserResponse.status).toBe(201);
        console.log("THE EVENT ROUTE RESPONSE", registerUserResponse.body)

        //VERIFY USER EMAIL
        const user = await User.findOne({ email: registeredUserData.email });  
        expect(user).toBeTruthy();
       // await new Promise(resolve => setTimeout(resolve, 1000));
        const verificationCode = user?.emailVerificationCode;
      expect(verificationCode).toBeTruthy();

        const verificationResponse = await request(app).patch("/api/v1/auth/verifyEmail").send({ verificationCode })
        console.log("THE VERIFICATION RESPONSE", verificationResponse.body)
        expect(verificationResponse.status).toBe(200) 

        const loginResponse = await request(app).post("/api/v1/auth/login").send(registeredUserData);
        console.log("THE LOGIN EVENT ROUTE RESPONSE", loginResponse.body)
        expect(loginResponse.status).toBe(200); 

        const createEventResponse = await request(app).post("/api/v1/event/createEvent").send(eventData);
        console.log("THE CREATE EVENT ROUTE RESPONSE", createEventResponse.body)
        expect(createEventResponse.status).toBe(401)
        console.log("THE EVENT ROUTE RESPONSE", createEventResponse.body)
    }, 50000)    

    
 
})