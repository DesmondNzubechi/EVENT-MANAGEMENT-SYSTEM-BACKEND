# Backend API for Event Booking Platform  

Welcome to the backend API of the Event Booking Platform! This API powers the core functionality of a robust event management system, providing secure user authentication, event management, booking, payments, and notifications.  

## Features  

1. **User Authentication & Authorization**  
   - Secure user and admin login with JWT-based authentication.  
   - Role-based access control for different features.  

2. **Event Management**  
   - Admins can create, update, and delete events.  
   - Users can view available events and book them.  

3. **Booking System**  
   - Users can book events and manage their bookings.  
   - Booking history and details are available.  

4. **Payment Integration**  
   - Secure payment gateway for processing user bookings.  

5. **Email Notifications**  
   - Automated emails for confirmations, updates, and cancellations.  

6. **Comprehensive Testing**  
   - Integration tests ensure reliability for authentication, user updates, and more.  

## Tech Stack  

- **Node.js**: Server-side JavaScript runtime.  
- **Express.js**: Backend framework for building the API.  
- **MongoDB**: Database for storing user, event, and booking data.  
- **JWT**: For secure authentication.  
- **Nodemailer**: For email notifications.  
- **Supertest**: For integration testing.  

## Installation  

1. Clone the repository:  
   ```bash  
   git clone https://github.com/desmondNzubechi/event-booking-backend.git  
   ```  

2. Navigate to the project directory:  
   ```bash  
   cd event-booking-backend  
   ```  

3. Install dependencies:  
   ```bash  
   npm install  
   ```  

4. Set up environment variables:  
   - Create a `.env` file in the root directory.  
   - Add the following variables:  
     ```plaintext  
     PORT=5000  
     DATABASE_URL=<Your MongoDB connection string>  
     JWT_SECRET=<Your JWT secret>  
     EMAIL_HOST=<Your email host>  
     EMAIL_PORT=<Your email port>  
     EMAIL_USER=<Your email user>  
     EMAIL_PASS=<Your email password>  
     NODE_ENV=<Your environment>
     JWT_EXPIRES_IN=<expiration date>
     JWT_COOKIE_EXPIRES=<expiration date>
     EMAIL_FROM=<your email>
     CLOUDINARY_API_KEY=<your cloudinary API key>
     CLOUDINARY_API_SECRET=<your secret>
     CLOUD_NAME=<name>
     CLOUDINARY_URL=<the url>
     ORIGIN_URL=<your frontend url>
     ```  

5. Start the server:  
   ```bash  
   npm start  
   ```  

## API Endpoints  
You can view and test all the available API endpoints by visiting the following link:

[`EVENT MANAGEMENT API`](https://ueventapi.vercel.app/api-docs/)

Once you're there, you'll find a comprehensive list of all the endpoints and how to interact with them.


Make sure to set `process.env.backendUrl` to the correct URL for your backend server.


This interactive documentation provides a user-friendly interface to test the API endpoints directly, with support for making requests like `GET`, `POST`, `PATCH`, and `DELETE`.

### Authentication  

- **POST** `/api/v1/auth/register`  
  Register a new user.  

- **POST** `/api/v1/auth/login`  
  Log in an existing user.  

- **POST** `/api/v1/auth/logout`  
  Log out the user.  

- **POST** `/api/v1/auth/forgot-password`  
  Initiate a password reset process.  

- **PATCH** `/api/v1/auth/reset-password/:token`  
  Reset the user’s password using the token.  

  - **GET** `/api/v1/auth/fetchMe`  
  Fetch authenticated user information

  - **PATCH** `/api/v1/auth/updateMe`  
  Update authenticated user information. 

  - **PATCH** `/api/v1/auth/changePassword`  
  Change the authenticated user password

  - **PATCH** `/api/v1/auth/verifyEmail`  
  Verify user email

  - **PATCH** `/api/v1/auth/sendVerificationCode`  
  Send Verification code to the user


### Users  

- **POST** `/api/v1/user/createUser`  
  create a new user (admin only).  

- **GET** `/api/v1/user/getAllUser`  
  Get all user details(admin only).

  - **GET** `/api/v1/user/getAUser`  
  Get user details by ID (admin only).  

- **DELETE** `/api/v1/user/deleteAUser`  
  Delete user(admin only)

  - **PATCH** `/api/v1/user/updateAUser`  
  update user details by ID (admin only).  
 

### Events  

- **GET** `/api/v1/event//getAllEvent`  
  Fetch all events.  

  - **GET** `/api/v1/event/event/:id`  
  Fetch an event..

- **POST** `/api/v1/event/createEvent`  
  Create a new event (admin only).  

- **PATCH** `/api/v1/event/updateEvent/:id`  
  Update event details (admin only).  

- **GET** `/api/v1/event/getAllPublishedEvent`  
  Fetch all published events

- **GET** `/api/v1/event/getAllUnpublishedEvent`  
  Fetch all unpublished events.(only admin)  

- **PATCH** `/api/v1/event//publishEvent`  
  Publish an event (only admin)

- **PATCH** `/api/v1/event/unPublishEvent`  
  Unpublish an event (admin only).  

- **DELETE** `/api/v1/event/deleteEvent/:id`  
  Delete an event by id(admin only).  

### Bookings  

- **POST** `/api/v1/booking/bookEvent/:eventId`  
  Create a new booking for an event.  

- **GET** `/api/v1/booking/getUserBookedEvent`  
  Fetch all bookings for the authenticated user.  

  - **GET** `/api/v1/booking/getAllTheEventBookings`  
  Fetch all booked event.(only admin)

- **GET** `/api/v1/booking/bookEvent/confirmPayment/:bookingId`  
  Confirm booking payment 

### Testing  

Run the test suite:  
```bash  
npm test  
```  
The backend has integration tests for critical features such as authentication and user updates.  

## Future Enhancements  

1. Add more filters and sorting options for events.  
2. Implement admin dashboard for better management.  
3. Enhance notifications with SMS support.  

## Contributions  

Contributions are welcome! Please fork the repository and submit a pull request with your proposed changes.  