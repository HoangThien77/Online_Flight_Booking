import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { bookingId } = req.query;

  if (req.method === "POST") {
    try {
      // Kiểm tra xem bookingId có tồn tại hay không
      const booking = await prisma.booking.findUnique({
        where: { id: parseInt(bookingId) },
      });

      if (!booking) {
        return res.status(404).json({ error: "Booking không tồn tại" });
      }

      await prisma.booking.update({
        where: { id: parseInt(bookingId) },
        data: { status: "Cancelled" },
      });

      // Trả về kết quả
      return res.status(200).json({ message: "Đã hủy vé thành công" });
    } catch (error) {
      console.error("Error canceling booking:", error);

      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // Method không được hỗ trợ
    res.setHeader("Allow", ["POST"]);

    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
