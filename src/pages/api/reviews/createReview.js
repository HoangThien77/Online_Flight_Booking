// src/pages/api/reviews/createReview.js
import { mkdir, rename } from "fs/promises";
import fs from "fs";
import path from "path";

import { getServerSession } from "next-auth";
import formidable from "formidable";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Đảm bảo các thư mục tồn tại
const ensureDirectories = async () => {
  const tmpDir = path.join(process.cwd(), "tmp");
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  for (const dir of [tmpDir, uploadsDir]) {
    if (!fs.existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
  }

  return { tmpDir, uploadsDir };
};

// Hàm lưu file
const saveFile = async (file, uploadsDir) => {
  const filename = `${Date.now()}-${file.originalFilename.replace(/\s/g, "-")}`;
  const newPath = path.join(uploadsDir, filename);

  await rename(file.filepath, newPath);

  return `/uploads/${filename}`;
};

export default async function handler(req, res) {
  // Chỉ chấp nhận method POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Tạo thư mục nếu chưa tồn tại
    const { tmpDir, uploadsDir } = await ensureDirectories();

    // Kiểm tra authentication
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Cấu hình formidable để xử lý form data
    const form = formidable({
      multiples: true, // Cho phép upload nhiều file
      maxFileSize: 10 * 1024 * 1024, // Giới hạn 10MB
      uploadDir: tmpDir,
      keepExtensions: true,
    });

    // Parse form data
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Xử lý và validate bookingId
    let bookingId;

    if (Array.isArray(fields.bookingId)) {
      bookingId = parseInt(fields.bookingId[0]);
    } else {
      bookingId = parseInt(fields.bookingId);
    }

    if (isNaN(bookingId)) {
      return res.status(400).json({
        message: "Invalid booking ID",
        receivedValue: fields.bookingId,
      });
    }

    // Xử lý các trường dữ liệu khác
    const rating = parseInt(
      Array.isArray(fields.rating) ? fields.rating[0] : fields.rating,
    );
    const comment = Array.isArray(fields.comment)
      ? fields.comment[0]
      : fields.comment || "";
    const emojis = fields.emojis
      ? JSON.parse(
          Array.isArray(fields.emojis) ? fields.emojis[0] : fields.emojis,
        )
      : [];

    // Tạo review với transaction
    const review = await prisma.$transaction(async (prisma) => {
      // Kiểm tra booking có tồn tại
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) {
        throw new Error(`Booking with ID ${bookingId} not found`);
      }

      // Tạo review
      const review = await prisma.review.create({
        data: {
          booking: {
            connect: { id: bookingId },
          },
          user: {
            connect: { id: session.user.id },
          },
          rating,
          comment,
        },
      });

      // Lưu ảnh nếu có
      if (files.images) {
        const imageFiles = Array.isArray(files.images)
          ? files.images
          : [files.images];

        for (const file of imageFiles) {
          try {
            const imageUrl = await saveFile(file, uploadsDir);

            await prisma.reviewImage.create({
              data: {
                reviewId: review.id,
                url: imageUrl,
              },
            });
          } catch (error) {
            console.error("Error saving image:", error);
          }
        }
      }

      // Lưu emojis nếu có
      if (emojis.length > 0) {
        await Promise.all(
          emojis.map((emoji) =>
            prisma.reviewEmoji.create({
              data: {
                reviewId: review.id,
                emoji: emoji.icon,
                label: emoji.label,
              },
            }),
          ),
        );
      }

      // Trả về review đã tạo
      return prisma.review.findUnique({
        where: { id: review.id },
        include: {
          images: true,
          emojis: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
    });

    // Trả về response thành công
    return res.status(200).json({
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error("Error creating review:", error);

    return res.status(500).json({
      message: "Error creating review",
      error: error.message,
    });
  }
}
