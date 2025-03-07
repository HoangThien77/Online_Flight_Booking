// pages/api/admin/export/today-flights.js
import { getToken } from "next-auth/jwt";

import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const token = await getToken({ req });

  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    // Lấy ngày hiện tại (đầu ngày và cuối ngày)
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Query các chuyến bay trong ngày
    const flights = await prisma.ticket.findMany({
      where: {
        departureTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        booking: {
          include: {
            customers: true, // để biết số lượng hành khách
          },
        },
      },
      orderBy: {
        departureTime: "asc",
      },
    });

    // Format dữ liệu cho CSV
    const headers = [
      "Số hiệu chuyến bay",
      "Hãng bay",
      "Điểm khởi hành",
      "Điểm đến",
      "Giờ khởi hành",
      "Giờ đến",
      "Hạng vé",
      "Số hành khách",
      "Trạng thái",
    ];

    const rows = [headers];

    flights.forEach((flight) => {
      rows.push([
        flight.flightNumber,
        flight.airline,
        flight.departureAirport,
        flight.arrivalAirport,
        new Date(flight.departureTime).toLocaleString("vi-VN"),
        new Date(flight.arrivalTime).toLocaleString("vi-VN"),
        flight.travelClass,
        flight.booking.customers.length.toString(),
        flight.booking.status,
      ]);
    });

    const csvContent = rows.map((row) => row.join(";")).join("\n");
    const BOM = "\uFEFF";

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=chuyen-bay-${new Date().toLocaleDateString("vi-VN").replace(/\//g, "-")}.csv`,
    );

    return res.send(BOM + csvContent);
  } catch (error) {
    console.error("Export error:", error);

    return res.status(500).json({ error: "Failed to export flights data" });
  }
}
