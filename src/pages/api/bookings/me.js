import { getToken } from "next-auth/jwt";

import prisma from "@/lib/prisma";
export default async function handler(req, res) {
  const token = await getToken({ req });

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const userId = token.id;

  try {
    // Truy vấn booking của người dùng từ Prisma
    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId,
      },
      include: {
        tickets: true,
        payment: true,
        customers: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    // Trả về mảng rỗng nếu không có booking nào
    return res.status(200).json(bookings || []);
  } catch (error) {
    console.error("Error fetching bookings:", error);

    return res.status(500).json({
      message: "Error fetching bookings",
      error: error.message,
    });
  }
}
