// src/lib/mail.js

import nodemailer from "nodemailer";
import * as handlebars from "handlebars";

import { paymentTemplate } from "./mail/templates/paymentbill";
import { generateInvoicePDF } from "./generatePDF";

export async function sendMail({
  to,
  name,
  subject,
  body,
  bookingData = null,
}) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  if (!SMTP_EMAIL || !SMTP_PASSWORD) {
    throw new Error("Missing SMTP credentials in environment variables");
  }

  // Create transporter with Gmail
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    // Verify connection
    await transport.verify();
    console.log("SMTP connection verified");

    // Prepare email options
    const mailOptions = {
      from: `"SummerTravel " <${SMTP_EMAIL}>`,
      to,
      subject,
      html: body,
    };

    // If bookingData is provided, generate and attach PDF invoice
    if (bookingData) {
      try {
        const pdfBuffer = await generateInvoicePDF(bookingData);

        mailOptions.attachments = [
          {
            filename: `hoa-don-${bookingData.pnrId}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ];
        console.log("PDF invoice generated successfully");
      } catch (pdfError) {
        console.error("Error generating PDF:", pdfError);
        // Continue sending email even if PDF generation fails
      }
    }

    // Send email
    const result = await transport.sendMail(mailOptions);

    console.log("Email sent successfully:", result.messageId);

    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export function compilePaymentTemplate(name, bookingReference) {
  const template = handlebars.compile(paymentTemplate);
  const htmlBody = template({
    name,
    bookingReference,
  });

  return htmlBody;
}
