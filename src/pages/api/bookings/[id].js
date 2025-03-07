import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  // Xử lý khi phương thức là GET (Lấy thông tin Booking theo ID)
  if (req.method === "GET") {
    try {
      const booking = await prisma.booking.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          tickets: true,
          payment: true,
          customers: true,
          user: true,
        },
      });

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found",
        });
      }

      // Transform data to include user info
      // const bookingInfo = {
      //   bookingId: booking.id,
      //   pnrId: booking.pnrId,
      //   // User info
      //   firstName: booking.user.name?.split(" ").slice(-1)[0] || "",
      //   lastName: booking.user.name?.split(" ").slice(0, -1).join(" ") || "",
      //   email: booking.user.email,
      //   phoneNumber: booking.user.phoneNumber,
      //   address: booking.user.address,
      //   // Booking info
      //   totalAmount: booking.totalAmount,
      //   status: booking.status, // Thêm trường status của booking
      //   paymentStatus: booking.payment?.status || "pending", // Đổi tên để phân biệt
      //   tickets: booking.tickets,
      //   payment: booking.payment,
      //   customers: booking.customers,
      //   isRoundTrip: booking.isRoundTrip,
      //   createdAt: booking.createdAt,
      // };

      return res.status(200).json(booking);
    } catch (error) {
      console.error("Error fetching booking:", error);

      return res.status(500).json({
        message: "Error fetching booking",
        error: error.message,
      });
    }
  }

  // Xử lý khi phương thức là DELETE (Xóa Booking theo ID)
  else if (req.method === "DELETE") {
    try {
      const deletedBooking = await prisma.booking.delete({
        where: {
          id: parseInt(id), // Chuyển đổi id thành số nguyên
        },
      });

      return res.status(200).json({
        message: "Booking deleted successfully",
        booking: deletedBooking,
      });
    } catch (error) {
      console.error("Error deleting booking:", error);

      return res.status(500).json({
        message: "Error deleting booking",
        error: error.message,
      });
    }
  }

  // Xử lý khi phương thức là PUT (Cập nhật thông tin Booking theo ID)
  else if (req.method === "PUT") {
    try {
      const {
        contactCustomerId,
        isRoundTrip,
        tickets,
        payment,
        totalAmount,
        pnrId,
      } = req.body;

      // Cập nhật Booking dựa trên ID
      const updatedBooking = await prisma.booking.update({
        where: {
          id: parseInt(id),
        },
        data: {
          pnrId,
          totalAmount,
          contactCustomerId,
          isRoundTrip,
        },
      });

      return res.status(200).json({
        message: "Booking updated successfully",
        booking: updatedBooking,
      });
    } catch (error) {
      console.error("Error updating booking:", error);

      return res.status(500).json({
        message: "Error updating booking",
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
