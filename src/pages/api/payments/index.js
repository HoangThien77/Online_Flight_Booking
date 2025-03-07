import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const range = JSON.parse(req.query.range || "[0,9]");
      const skip = range[0];
      const take = range[1] - range[0] + 1;

      // Truy vấn danh sách các payment với hỗ trợ phân trang
      const payments = await prisma.payment.findMany({
        skip,
        take,
      });

      // Đếm tổng số payments
      const total = await prisma.payment.count();

      // Thiết lập header trả về tổng số payment
      res.setHeader(
        "Content-Range",
        `payments ${range[0]}-${range[1]}/${total}`,
      );
      res.setHeader("Access-Control-Expose-Headers", "Content-Range");
      res.status(200).json({
        data: payments,
        total: total,
      });
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  } else if (req.method === "POST") {
    try {
      const { bookingId, amount, paymentMethod, status } = req.body;

      // Tạo mới payment
      const payment = await prisma.payment.create({
        data: {
          bookingId,
          amount,
          paymentMethod,
          status,
        },
      });

      return res.status(201).json({
        message: "Payment added successfully",
        payment: payment,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
