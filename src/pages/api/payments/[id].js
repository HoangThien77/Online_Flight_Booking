import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  // Xử lý khi phương thức là GET (Lấy thông tin Payment theo ID)
  if (req.method === "GET") {
    try {
      const payment = await prisma.payment.findUnique({
        where: {
          id: parseInt(id), // Chuyển đổi id thành số nguyên
        },
      });

      if (!payment) {
        return res.status(404).json({
          message: "Payment not found",
        });
      }

      return res.status(200).json(payment);
    } catch (error) {
      console.error("Error fetching payment:", error);

      return res.status(500).json({
        message: "Error fetching payment",
        error: error.message,
      });
    }
  }

  // Xử lý khi phương thức là DELETE (Xóa Payment theo ID)
  else if (req.method === "DELETE") {
    try {
      const deletedPayment = await prisma.payment.delete({
        where: {
          id: parseInt(id), // Chuyển đổi id thành số nguyên
        },
      });

      return res.status(200).json({
        message: "Payment deleted successfully",
        payment: deletedPayment,
      });
    } catch (error) {
      console.error("Error deleting payment:", error);

      return res.status(500).json({
        message: "Error deleting payment",
        error: error.message,
      });
    }
  }

  // Xử lý khi phương thức là PUT (Cập nhật thông tin Payment theo ID)
  else if (req.method === "PUT") {
    try {
      const { bookingId, amount, paymentMethod, status } = req.body;

      // Cập nhật Payment dựa trên ID
      const updatedPayment = await prisma.payment.update({
        where: {
          id: parseInt(id), // Chuyển đổi id thành số nguyên
        },
        data: {
          bookingId,
          amount,
          paymentMethod,
          status,
        },
      });

      return res.status(200).json({
        message: "Payment updated successfully",
        payment: updatedPayment,
      });
    } catch (error) {
      console.error("Error updating payment:", error);

      return res.status(500).json({
        message: "Error updating payment",
        error: error.message,
      });
    }
  }

  // Trả về lỗi nếu không phải là GET, DELETE, hoặc PUT
  else {
    return res.status(405).json({
      message: "Method Not Allowed",
    });
  }
}
