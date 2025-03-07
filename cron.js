const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const startCronJobs = () => {
  console.log("Initializing cron jobs...");

  // Chạy cron job mỗi phút để kiểm tra
  cron.schedule("* * * * *", async () => {
    console.log("Running cron job every minute...");

    try {
      const now = new Date();

      // Lấy danh sách booking cần cập nhật
      const bookings = await prisma.booking.findMany({
        include: {
          tickets: true,
        },
        where: {
          status: { not: "Completed" },
        },
      });

      const bookingsToComplete = bookings.filter((booking) =>
        booking.tickets.every((ticket) => new Date(ticket.departureTime) < now),
      );

      const updatedBookings = await prisma.$transaction(
        bookingsToComplete.map((booking) =>
          prisma.booking.update({
            where: { id: booking.id },
            data: { status: "Completed" },
          }),
        ),
      );

      console.log(`Updated ${updatedBookings.length} bookings to "Completed".`);
    } catch (error) {
      console.error("Error running cron job:", error);
    }
  });
};

startCronJobs();
