// pages/api/admin/export/today-passengers.js
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    // Lấy ngày hiện tại
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Query hành khách có chuyến bay trong ngày
    const tickets = await prisma.ticket.findMany({
      where: {
        departureTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        booking: {
          include: {
            customers: true,
            user: true, // thông tin người đặt
          },
        },
      },
    });

    // Format dữ liệu cho CSV
    const headers = [
      "Họ tên",
      "Ngày sinh",
      "Giới tính",
      "Quốc tịch",
      "Số hiệu chuyến bay",
      "Hãng bay",
      "Giờ khởi hành",
      "Hạng vé",
      "Số ghế",
      "Người đặt",
      "SĐT liên hệ",
    ];

    const rows = [headers];

    tickets.forEach((ticket) => {
      ticket.booking.customers.forEach((customer) => {
        rows.push([
          `${customer.firstName} ${customer.middleName || ""} ${customer.lastName}`.trim(),
          new Date(customer.dateOfBirth).toLocaleDateString("vi-VN"),
          customer.gender,
          customer.nationality,
          ticket.flightNumber,
          ticket.airline,
          new Date(ticket.departureTime).toLocaleString("vi-VN"),
          ticket.travelClass,
          ticket.seatNumber,
          ticket.booking.user.name,
          ticket.booking.user.phoneNumber || "N/A",
        ]);
      });
    });

    const csvContent = rows.map((row) => row.join(";")).join("\n");
    const BOM = "\uFEFF";

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=hanh-khach-${new Date().toLocaleDateString("vi-VN").replace(/\//g, "-")}.csv`,
    );

    return res.send(BOM + csvContent);
  } catch (error) {
    console.error("Export error:", error);

    return res.status(500).json({ error: "Failed to export passengers data" });
  }
}
