import { subDays, format, startOfToday, endOfToday } from "date-fns";

import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    const thirtyDaysAgo = subDays(new Date(), 30);

    // Tổng doanh thu
    const totalRevenue = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "successful" },
    });

    // Tổng số lượng booking
    const totalBooking = await prisma.booking.count();

    // Số lượng booking mới trong 7 ngày qua
    const newBooking = await prisma.booking.count({
      where: {
        createdAt: { gte: subDays(new Date(), 7) },
      },
    });

    // Doanh thu hàng ngày trong 30 ngày gần đây cho biểu đồ
    const dailyRevenue = await prisma.payment.groupBy({
      by: ["createdAt"],
      _sum: { amount: true },
      where: {
        status: "successful",
        createdAt: { gte: thirtyDaysAgo },
      },
      orderBy: { createdAt: "asc" },
    });

    // Định dạng dữ liệu biểu đồ
    const monthlyRevenue = dailyRevenue.map(({ createdAt, _sum }) => ({
      date: format(new Date(createdAt), "yyyy-MM-dd"),
      revenue: _sum.amount || 0,
    }));

    // Lấy danh sách hành khách có chuyến bay trong ngày hôm nay
    const passengersToday = await prisma.customer.findMany({
      where: {
        booking: {
          tickets: {
            some: {
              departureTime: {
                gte: startOfToday(),
                lte: endOfToday(),
              },
            },
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        booking: {
          select: {
            tickets: {
              select: {
                flightNumber: true,
                departureTime: true,
              },
              where: {
                departureTime: {
                  gte: startOfToday(),
                  lte: endOfToday(),
                },
              },
            },
          },
        },
      },
    });

    // Trả về tất cả dữ liệu trong một response
    res.status(200).json({
      success: true,
      totalRevenue: totalRevenue._sum.amount || 0,
      totalBooking,
      newBooking,
      monthlyRevenue,
      passengersToday,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
    });
  }
}
