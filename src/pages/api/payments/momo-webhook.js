// pages/api/momo-ipn.js
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log(req.body);
    const { orderId, resultCode } = req.body;

    try {
      // Nếu resultCode = 0 nghĩa là thanh toán thành công
      if (resultCode === 0) {
        const bookingId = parseInt(orderId, 10);

        // Cập nhật trạng thái thanh toán thành công cho bookingId
        await prisma.payment.update({
          where: { bookingId },
          data: { status: "successful" },
        });

        // Cập nhật trạng thái booking là "Completed"
        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: "Completed" },
        });

        return res
          .status(200)
          .json({ message: "Payment status updated successfully" });
      } else {
        return res.status(400).json({ message: "Payment failed or canceled" });
      }
    } catch (error) {
      console.error("Error updating payment status:", error);

      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end("Method Not Allowed");
  }
}
