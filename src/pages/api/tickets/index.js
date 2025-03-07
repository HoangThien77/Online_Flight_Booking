import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const range = JSON.parse(req.query.range || "[0,9]");
      const skip = range[0];
      const take = range[1] - range[0] + 1;

      // Truy vấn danh sách các vé (tickets) với hỗ trợ phân trang
      const tickets = await prisma.ticket.findMany({
        skip,
        take,
      });

      // Đếm tổng số vé (tickets)
      const total = await prisma.ticket.count();

      // Thiết lập header trả về tổng số vé
      res.setHeader(
        "Content-Range",
        `tickets ${range[0]}-${range[1]}/${total}`,
      );
      res.setHeader("Access-Control-Expose-Headers", "Content-Range");
      res.status(200).json({
        data: tickets,
        total: total,
      });
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  } else if (req.method === "POST") {
    try {
      const {
        flightNumber,
        airline,
        departureAirport,
        arrivalAirport,
        departureTime,
        arrivalTime,
        travelClass,
        price,
        bookingId,
        total_duration,
        seatNumber,
        tripType,
      } = req.body;

      // Tạo mới vé (ticket)
      const ticket = await prisma.ticket.create({
        data: {
          flightNumber,
          airline,
          departureAirport,
          arrivalAirport,
          departureTime: new Date(departureTime),
          arrivalTime: new Date(arrivalTime),
          travelClass,
          price,
          bookingId,
          total_duration,
          seatNumber,
          tripType,
        },
      });

      return res.status(201).json({
        message: "Ticket added successfully",
        ticket: ticket,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
