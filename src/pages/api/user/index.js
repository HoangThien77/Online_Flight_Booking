import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const range = JSON.parse(req.query.range || "[0,9]");
      const skip = range[0];
      const take = range[1] - range[0] + 1;

      // Truy vấn danh sách ContactCustomer với phân trang
      const user = await prisma.user.findMany({
        skip,
        take,
        include: {
          bookings: true, // Bao gồm các Booking liên quan
        },
      });

      // Đếm tổng số ContactCustomer
      const total = await prisma.user.count();

      // Thiết lập header trả về tổng số contactCustomers
      res.setHeader(
        "Content-Range",
        `contactCustomers ${range[0]}-${range[1]}/${total}`,
      );
      res.setHeader("Access-Control-Expose-Headers", "Content-Range");
      res.status(200).json({
        data: user,
        total: total,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  } else if (req.method === "POST") {
    try {
      const { firstName, lastName, phone, email, bookings } = req.body;

      // Tạo mới một ContactCustomer
      const user = await prisma.contactCustomer.create({
        data: {
          firstName,
          lastName,
          phone,
          email,
          bookings: {
            create: bookings, // Tạo các booking liên quan nếu có
          },
        },
      });

      return res.status(201).json({
        message: "User added successfully",
        user: user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
