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
exports.buyEventTicket = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const https = __importStar(require("https")); // Import https module
exports.buyEventTicket = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    const reqPaystack = https.request(options, (resPaystack) => {
        let data = "";
        resPaystack.on("data", (chunk) => {
            data += chunk; // Append chunk data to the data variable
        });
        resPaystack.on("end", () => {
            // Parse the JSON response and send it back to the client
            try {
                const response = JSON.parse(data);
                res.status(200).json(response);
            }
            catch (err) {
                // Handle JSON parsing error
                next(err); // Pass the error to the error handling middleware
            }
        });
    });
    // Handle request errors
    reqPaystack.on("error", (error) => {
        console.error("Error making request to Paystack:", error);
        res.status(500).json({ error: "Internal Server Error" });
    });
    // Write the parameters to the request body
    reqPaystack.write(params);
    reqPaystack.end();
}));
