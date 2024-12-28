"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReceiptPdf = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const buffer_1 = require("buffer");
const generateReceiptPdf = (receiptDetails) => {
    return new Promise((resolve, reject) => {
        const doc = new pdfkit_1.default({ size: "A4", margin: 50 });
        let bufferChunks = [];
        // Capture the PDF into a buffer
        doc.on("data", (chunk) => bufferChunks.push(chunk));
        doc.on("end", () => resolve(buffer_1.Buffer.concat(bufferChunks)));
        doc.on("error", reject);
        // Add title
        doc
            .fontSize(25)
            .font("Helvetica-Bold")
            .text(`Payment Receipt For ${receiptDetails.title} Ticket`, {
            align: "center",
        });
        doc.moveDown(); // Move down after the title
        // Add receipt details
        doc
            .fontSize(16)
            .font("Helvetica")
            .text(`User Name: ${receiptDetails.fullName}`);
        doc.moveDown();
        doc.fontSize(16).font("Helvetica").text(`Email: ${receiptDetails.email}`);
        doc.moveDown();
        doc.text(`Event: ${receiptDetails.title}`);
        doc.moveDown();
        doc.text(`Amount Paid: ${receiptDetails.price}`);
        doc.moveDown();
        doc.text(`Date: ${receiptDetails.date}`);
        doc.moveDown();
        doc.text(`Ticket Number: ${receiptDetails.ticketNumber}`);
        doc.moveDown();
        doc.text(`Event Location: ${receiptDetails.location}`);
        // Add a footer with italic text
        doc
            .moveDown()
            .font("Helvetica-Oblique")
            .text("Thank you for your purchase!", { align: "center" });
        // Finalize the PDF
        doc.end();
    });
};
exports.generateReceiptPdf = generateReceiptPdf;
