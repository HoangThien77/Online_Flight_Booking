import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  // Xử lý khi phương thức là GET (Lấy thông tin Ticket theo ID)
  if (req.method === "GET") {
    try {
      const ticket = await prisma.ticket.findUnique({
        where: {
          id: parseInt(id), // Chuyển đổi id thành số nguyên
        },
      });

      if (!ticket) {
        return res.status(404).json({
          message: "Ticket not found",
        });
      }

      return res.status(200).json(ticket);
    } catch (error) {
      console.error("Error fetching ticket:", error);

      return res.status(500).json({
        message: "Error fetching ticket",
        error: error.message,
      });
    }
  }

  // Xử lý khi phương thức là DELETE (Xóa Ticket theo ID)
  else if (req.method === "DELETE") {
    try {
      const deletedTicket = await prisma.ticket.delete({
        where: {
          id: parseInt(id), // Chuyển đổi id thành số nguyên
        },
      });

      return res.status(200).json({
        message: "Ticket deleted successfully",
        ticket: deletedTicket,
      });
    } catch (error) {
      console.error("Error deleting ticket:", error);

      return res.status(500).json({
        message: "Error deleting ticket",
        error: error.message,
      });
    }
  }

  // Xử lý khi phương thức là PUT (Cập nhật thông tin Ticket theo ID)
  else if (req.method === "PUT") {
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
        seatNumber,
        tripType,
      } = req.body;

      // Cập nhật Ticket dựa trên ID
      const updatedTicket = await prisma.ticket.update({
        where: {
          id: parseInt(id), // Chuyển đổi id thành số nguyên
        },
        data: {
          flightNumber,
          airline,
          departureAirport,
          arrivalAirport,
          departureTime: new Date(departureTime),
          arrivalTime: new Date(arrivalTime),
          total_duration,
          travelClass,
          price,
          seatNumber,
          tripType,
        },
      });

      return res.status(200).json({
        message: "Ticket updated successfully",
        ticket: updatedTicket,
      });
    } catch (error) {
      console.error("Error updating ticket:", error);

      return res.status(500).json({
        message: "Error updating ticket",
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
