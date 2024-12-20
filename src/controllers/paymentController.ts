import catchAsync from "../utils/catchAsync";
import { IncomingMessage } from "http"; // Import types from 'http'
import * as https from "https"; // Import https module

export const buyEventTicket = catchAsync(async (req, res, next) => {
  const params = JSON.stringify({
    email: "customer@email.com",
    amount: "20000",
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: `Bearer sk_test_b1a615c5045b91608dbdcafe32f6e7665b8d41f5`,
      "Content-Type": "application/json",
    },
  };

  const reqPaystack = https.request(options, (resPaystack: IncomingMessage) => {
    let data = "";

    resPaystack.on("data", (chunk: Buffer) => {
      data += chunk; // Append chunk data to the data variable
    });

    resPaystack.on("end", () => {
      // Parse the JSON response and send it back to the client
      try {
        const response = JSON.parse(data);
        res.status(200).json(response);
      } catch (err) {
        // Handle JSON parsing error
        next(err); // Pass the error to the error handling middleware
      }
    });
  });

  // Handle request errors
  reqPaystack.on("error", (error: Error) => {
    console.error("Error making request to Paystack:", error);
    res.status(500).json({ error: "Internal Server Error" });
  });

  // Write the parameters to the request body
  reqPaystack.write(params);
  reqPaystack.end();
});
