import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const range = JSON.parse(req.query.range || "[0,9]");
      const skip = range[0];
      const take = range[1] - range[0] + 1;

      const customers = await prisma.customer.findMany({
        skip,
        take,
      });

      const total = await prisma.customer.count();

      res.setHeader(
        "Content-Range",
        `customers ${range[0]}-${range[1]}/${total}`,
      );
      res.setHeader("Access-Control-Expose-Headers", "Content-Range");
      res.status(200).json({
        data: customers,
        total: total,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  } else if (req.method === "POST") {
    try {
      const {
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        gender,
        nationality,
        passportNumber,
        passportExpiry,
        passportIssuedAt,
      } = req.body;
      const customer = await prisma.customer.create({
        data: {
          firstName,
          middleName,
          lastName,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          nationality,
          passportNumber,
          passportExpiry: new Date(passportExpiry),
          passportIssuedAt,
        },
      });

      return res.status(201).json({
        message: "Customer added successfully",
        customer: customer,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
