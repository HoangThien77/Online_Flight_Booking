import Stripe from "stripe";

import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { bookingId } = req.body;

  if (req.method === "POST") {
    const booking = await prisma.booking.findUnique({
      where: {
        id: parseInt(bookingId),
      },
      include: {
        user: true,
        payment: true,
      },
    });

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "vnd",
              product_data: {
                name: `SummerTravel.vn - ${booking.isRoundTrip ? "Khứ hồi" : "Một chiều"}`,
              },
              unit_amount: Math.round(booking.totalAmount),
            },
            quantity: 1,
          },
        ],
        customer_email: booking.user.email,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&bookingId=${bookingId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancel?session_id={CHECKOUT_SESSION_ID}&bookingId=${bookingId}`,
      });

      if (!booking.payment) {
        await prisma.payment.create({
          data: {
            bookingId,
            amount: booking.totalAmount,
            paymentMethod: "stripe",
            status: "pending",
          },
        });
      }

      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error("Stripe Error:", error);
      res.status(500).json({ error: "Đã xảy ra lỗi khi tạo phiên thanh toán" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end("Method Not Allowed");
  }
}
