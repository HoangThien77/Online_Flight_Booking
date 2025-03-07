import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { paymentId, status } = req.body;

    try {
      // Cập nhật trạng thái thanh toán
      const updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: { status },
      });

      res.status(200).json({ message: "Payment status updated successfully" });
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ error: "Error updating payment status" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
