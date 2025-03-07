import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log(req.body);
    const { email, password, name, phoneNumber } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại." });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phoneNumber,
        },
      });
      return res
        .status(201)
        .json({ message: "Đăng ký thành công", user: newUser });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Có lỗi xảy ra trong quá trình đăng ký." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
