import { getToken } from "next-auth/jwt";

import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const token = await getToken({ req });

  if (!token || token.role != "ADMIN") {
    return res.status(401).json({ message: "Not authenticated" });
  }
  try {
    const { month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const dailyStats = await prisma.booking.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: "Completed",
      },
      _sum: {
        totalAmount: true,
      },
      _count: {
        _all: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const headers = ["Ngày", "Số Booking", "Doanh Thu"];
    const rows = [headers];

    const daysInMonth = endDate.getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayStats = dailyStats.find(
        (item) => new Date(item.createdAt).getDate() === day,
      );

      rows.push([
        date.toLocaleDateString("vi-VN"),
        dayStats ? dayStats._count._all.toString() : "0",
        dayStats ? dayStats._sum.totalAmount.toLocaleString("vi-VN") : "0",
      ]);
    }

    // Sử dụng dấu chấm phẩy làm delimiter
    const csvContent = rows.map((row) => row.join(";")).join("\n");
    const BOM = "\uFEFF";

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=bao-cao-thang-${month}-${year}.csv`,
    );

    return res.send(BOM + csvContent);
  } catch (error) {
    console.error("Export error:", error);

    return res.status(500).json({ error: "Failed to export revenue data" });
  }
}
