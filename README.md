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
   git clone https://github.com/your-username/event-booking-backend.git
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
      `plaintext  
     DATABASE_URL=
PORT=
NODE_ENV=
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_COOKIE_EXPIRES=
EMAIL_PASSWORD=
EMAIL_USERNAME=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_FROM=
ORIGIN_URL=
TEST_URL=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUD_NAME=
CLOUDINARY_URL=
backendUrl=
     `

5. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

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

### Users

- **GET** `/api/v1/users/:id`  
  Get user details by ID (admin only).

- **PATCH** `/api/v1/users/:id`  
  Update user profile.

### Events

- **GET** `/api/v1/events`  
  Fetch all events.

- **POST** `/api/v1/events`  
  Create a new event (admin only).

- **PATCH** `/api/v1/events/:id`  
  Update event details (admin only).

- **DELETE** `/api/v1/events/:id`  
  Delete an event (admin only).

### Bookings

- **POST** `/api/v1/bookings`  
  Create a new booking for an event.

- **GET** `/api/v1/bookings`  
  Fetch all bookings for the authenticated user.

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
