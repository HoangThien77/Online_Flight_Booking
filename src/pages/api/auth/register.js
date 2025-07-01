// pages/api/auth/register.js
import bcrypt from "bcrypt";

import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
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

      // Dispatch action để cập nhật Redux store (lưu ý: điều này chỉ hoạt động phía client)
      // Ở đây chỉ trả về dữ liệu, client sẽ dispatch action
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
