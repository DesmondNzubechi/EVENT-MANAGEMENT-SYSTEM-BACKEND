import PDFDocument from 'pdfkit';
import { Buffer } from 'buffer';

export const generateReceiptPdf = (receiptDetails: any): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });

        let bufferChunks: Uint8Array[] = [];

        // Capture the PDF into a buffer
        doc.on('data', chunk => bufferChunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(bufferChunks)));
        doc.on('error', reject);

        // Add a logo or header image (if you have one)
        // doc.image('path/to/logo.png', 50, 45, { width: 100 });


        // Add title
        doc.fontSize(25).font('Helvetica-Bold').text(`Payment Receipt For ${receiptDetails.title} Ticket`, { align: 'center', });
        doc.moveDown(); // Move down after the title

        // Add receipt details
        doc.fontSize(16).font('Helvetica').text(`User Name: ${receiptDetails.fullName}`)
        doc.moveDown();
        doc.fontSize(16).font('Helvetica').text(`Email: ${receiptDetails.email}`);
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
        doc.moveDown().font('Helvetica-Oblique').text('Thank you for your purchase!', { align: 'center' });

        // Finalize the PDF
        doc.end();
    });
};
