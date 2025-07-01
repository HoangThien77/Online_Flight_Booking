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

const ensureDirectories = async () => {
  const tmpDir = path.join(process.cwd(), "tmp");
  const usersDir = path.join(process.cwd(), "public", "users");

  for (const dir of [tmpDir, usersDir]) {
    if (!fs.existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
  }

  return { tmpDir, usersDir };
};

const saveFile = async (file, usersDir) => {
  const filename = `${Date.now()}-${file.originalFilename.replace(/\s/g, "-")}`;
  const newPath = path.join(usersDir, filename);

  await rename(file.filepath, newPath);

  return `/users/${filename}`;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { tmpDir, usersDir } = await ensureDirectories();
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const form = formidable({
      multiples: false,
      maxFileSize: 5 * 1024 * 1024,
      uploadDir: tmpDir,
      keepExtensions: true,
    });
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    if (!files || !files.avatar) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const file = Array.isArray(files.avatar) ? files.avatar[0] : files.avatar;
    const imageUrl = await saveFile(file, usersDir);

    console.log("Image URL saved:", imageUrl); // Debug log
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        image: true,
        address: true,
      },
    });

    console.log("Updated user in DB:", updatedUser); // Debug log

    return res.status(200).json({
      message: "Avatar uploaded successfully",
      image: imageUrl,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error uploading avatar:", error);

    return res.status(500).json({
      message: "Error uploading avatar",
      error: error.message,
    });
  }
}
