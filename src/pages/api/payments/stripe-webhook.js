import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);

      return;
    }

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;

        // Xử lý khi thanh toán hoàn tất
        break;
      case "checkout.session.expired":
        const expiredSession = event.data.object;

        // Xử lý khi phiên thanh toán hết hạn
        break;
      case "payment_intent.payment_failed":
        const paymentIntent = event.data.object;

        // Xử lý khi thanh toán thất bại
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
