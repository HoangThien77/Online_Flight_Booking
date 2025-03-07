import crypto from "crypto";

import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { bookingId, totalAmount } = req.body;

    const booking = await prisma.booking.findUnique({
      where: {
        id: parseInt(bookingId),
      },
      include: {
        user: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const payment = await prisma.payment.upsert({
      where: {
        bookingId: parseInt(bookingId),
      },
      update: {
        amount: totalAmount,
        paymentMethod: "momo",
        status: "pending",
      },
      create: {
        bookingId: parseInt(bookingId),
        amount: totalAmount,
        paymentMethod: "momo",
        status: "pending",
      },
    });

    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?bookingId=${bookingId}`;
    const ipnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/momo-webhook`;
    const requestId = partnerCode + new Date().getTime();
    const orderId = `${bookingId}-${Date.now()}`;
    const requestType = "payWithMethod";
    const orderInfo = `Đặt vé máy bay - ${booking.user.email}`;

    // Create signature
    const rawSignature = `accessKey=${accessKey}&amount=${totalAmount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const response = await fetch(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          partnerCode,
          accessKey,
          requestId,
          amount: totalAmount,
          orderId,
          orderInfo,
          redirectUrl,
          ipnUrl,
          extraData: "",
          requestType,
          signature,
        }),
      },
    );

    const data = await response.json();

    if (response.ok && data.payUrl) {
      return res.status(200).json({ payUrl: data.payUrl });
    } else {
      console.error("Failed to create MoMo payment:", data);

      return res.status(400).json({
        message: "Failed to create MoMo payment",
        data,
      });
    }
  } catch (error) {
    console.error("Error creating MoMo payment:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
