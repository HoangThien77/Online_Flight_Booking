import { getToken } from "next-auth/jwt";

import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  // Lấy token và kiểm tra authentication cho cả GET và POST
  const token = await getToken({ req });

  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const userId = token.id;

  if (req.method === "GET") {
    try {
      const token = await getToken({ req });

      if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // Kiểm tra xem token có email không
      if (!token.email) {
        return res.status(400).json({ message: "Email not found in token" });
      }

      // Tìm user bằng email thay vì id
      const profile = await prisma.user.findUnique({
        where: {
          email: token.email,
        },
        select: {
          id: true,
          email: true,
          name: true,
          phoneNumber: true,
          image: true,
          address: true,
        },
      });

      if (!profile) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);

      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, phoneNumber, address } = req.body;

      // Validation
      if (!name && !phoneNumber && !address) {
        return res.status(400).json({
          message: "Vui lòng cung cấp ít nhất một thông tin để cập nhật",
        });
      }

      // Tạo object chứa các trường cần update
      const updateData = {};

      if (name) updateData.name = name;
      if (phoneNumber) updateData.phoneNumber = phoneNumber;
      if (address) updateData.address = address;

      const updatedProfile = await prisma.user.update({
        where: {
          email: token.email,
        },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          phoneNumber: true,
          image: true,
          address: true,
        },
      });

      return res.status(200).json(updatedProfile);
    } catch (error) {
      console.error("Error updating profile:", error);

      return res.status(500).json({
        message: "Có lỗi xảy ra khi cập nhật thông tin",
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
