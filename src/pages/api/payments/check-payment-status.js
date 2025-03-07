// /pages/api/payments/check-payment-status.js
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { sessionId } = req.body;

  try {
    console.log("Checking payment status for session:", sessionId);

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log("Stripe session details:", {
      payment_status: session.payment_status,
      status: session.status,
      payment_intent: session.payment_intent,
    });

    // Kiểm tra các trường hợp thành công
    if (
      session.payment_status === "paid" ||
      session.status === "complete" ||
      session.payment_status === "succeeded"
    ) {
      return res.status(200).json({
        status: "complete",
        payment_status: session.payment_status,
      });
    }

    // Kiểm tra các trường hợp thất bại
    if (
      session.status === "expired" ||
      session.status === "canceled" ||
      session.payment_status === "failed"
    ) {
      return res.status(200).json({
        status: "failed",
        payment_status: session.payment_status,
      });
    }

    // Trường hợp còn lại - đang xử lý
    return res.status(200).json({
      status: "processing",
      payment_status: session.payment_status,
    });
  } catch (error) {
    console.error("Error checking payment status:", error);

    return res.status(500).json({
      error: "Failed to check payment status",
      details: error.message,
    });
  }
}
