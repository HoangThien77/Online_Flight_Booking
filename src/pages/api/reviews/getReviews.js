// src/pages/api/reviews/getReviews.js
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: true,
        images: true,
        emojis: true,
        booking: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      bookingId: review.bookingId,
      userId: review.userId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      user: {
        name: review.user.name,
        image: review.user.image,
      },
      images: review.images.map((img) => img.url),
      emojis: review.emojis.map((emoji) => ({
        icon: emoji.emoji,
        label: emoji.label,
      })),
    }));

    res.status(200).json(formattedReviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
}
