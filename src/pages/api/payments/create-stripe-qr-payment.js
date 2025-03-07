import Stripe from "stripe";
import QRCode from "qrcode";

import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);

    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    totalPrice,
    flightType,
    airlineName,
    airlineLogos,
    passengerInfo,
    bookingId,
  } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: "bookingId is required" });
  }

  try {
    console.log("Creating QR payment for bookingId:", bookingId);

    // Tạo Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "vnd",
            product_data: {
              name: `Vemaybay.vn - ${flightType} - ${airlineName}`,
              description: `Hành khách: ${passengerInfo.firstName} ${passengerInfo.lastName}`,
              images: airlineLogos,
            },
            unit_amount: Math.round(totalPrice),
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: bookingId.toString(),
      },
      customer_email: passengerInfo.email,
      mode: "payment",
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Hết hạn sau 30 phút
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&bookingId=${bookingId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-fail?session_id={CHECKOUT_SESSION_ID}&bookingId=${bookingId}`,
    });

    // Tạo QR code
    const qrCodeDataUrl = await QRCode.toDataURL(session.url);

    // Tạo hoặc cập nhật payment
    await prisma.payment.create({
      data: {
        amount: totalPrice,
        paymentMethod: "stripe_qr",
        status: "pending",
        booking: {
          connect: {
            id: parseInt(bookingId),
          },
        },
      },
    });

    return res.status(200).json({
      url: session.url,
      qrCodeUrl: qrCodeDataUrl,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Stripe QR Payment Error:", error);

    return res.status(500).json({
      error: "Đã xảy ra lỗi khi tạo phiên thanh toán QR",
      details: error.message,
    });
  }
}
