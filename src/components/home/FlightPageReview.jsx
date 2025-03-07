"use client";

import { ChevronLeft, ChevronRight, Star, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function FlightPageReview() {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews/getReviews");
        const data = await response.json();

        const avgRating =
          data.reduce((acc, review) => acc + review.rating, 0) / data.length;

        const formattedReviews = data.map((review) => {
          return {
            name: review.user?.name || "Khách hàng ẩn danh",
            timeAgo: formatTimeAgo(review.createdAt),
            rating: review.rating,
            text: review.comment,
            avatar:
              review.user?.image ||
              (review.user?.name?.[0] || "K").toUpperCase(),
            verified: true,
            images: review.images || [], // Add support for images
            emojis: review.emojis || [], // Add support for emojis
          };
        });

        setReviews(formattedReviews);
        setAverageRating(avgRating);
        setTotalReviews(data.length);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Hôm nay";
    if (diffInDays === 1) return "Hôm qua";

    return `${diffInDays} ngày trước`;
  };

  // Image Gallery Modal
  const ImageGallery = ({ images, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
        <div className="relative max-h-[90vh] max-w-[90vw]">
          <button
            onClick={onClose}
            className="absolute -right-4 -top-4 rounded-full bg-white p-2 text-gray-800 shadow-lg"
          >
            <X className="size-6" />
          </button>
          <img
            src={images[currentIndex]}
            alt={`Review image ${currentIndex + 1}`}
            className="max-h-[80vh] rounded-lg object-contain"
          />
          {images.length > 1 && (
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`size-2 rounded-full ${
                    idx === currentIndex ? "bg-white" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1,
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                onClick={() =>
                  setCurrentIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1,
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section
      className="w-full bg-white px-4 py-12"
      style={{ marginTop: "50px" }}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Trải nghiệm của khách hàng
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Khám phá những chia sẻ chân thực từ khách hàng đã trải nghiệm dịch
            vụ của chúng tôi
          </p>
        </div>

        {/* Overall rating */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`size-6 ${
                    i < Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500">
              ({totalReviews} đánh giá)
            </div>
          </div>
        </div>

        {/* Reviews carousel */}
        {reviews.length > 0 ? (
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              pagination={{
                clickable: true,
                bulletActiveClass: "!bg-blue-500",
                bulletClass:
                  "inline-block h-2 w-2 rounded-full bg-gray-200 mx-1",
              }}
              navigation={{
                prevEl: ".swiper-button-prev",
                nextEl: ".swiper-button-next",
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="!pb-12"
            >
              {reviews.map((review, index) => (
                <SwiperSlide key={index}>
                  <div className="rounded-lg bg-white p-6 shadow">
                    <div className="mb-4 flex items-start gap-3">
                      {typeof review.avatar === "string" &&
                      review.avatar.startsWith("http") ? (
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="size-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          {review.avatar}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <h3 className="font-medium">{review.name}</h3>
                          {review.verified && (
                            <svg
                              viewBox="0 0 24 24"
                              className="size-4 fill-blue-500"
                            >
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {review.timeAgo}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3 flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">{review.text}</p>

                    {/* Emoji display */}
                    {review.emojis && review.emojis.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {review.emojis.map((emoji, idx) => (
                          <span key={idx} className="inline-block text-lg">
                            {emoji.icon}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Image preview */}
                    {review.images && review.images.length > 0 && (
                      <div className="mt-4">
                        <div className="grid grid-cols-3 gap-2">
                          {review.images.slice(0, 3).map((image, idx) => (
                            <div
                              key={idx}
                              className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                              onClick={() => setSelectedImages(review.images)}
                            >
                              <img
                                src={image}
                                alt={`Review image ${idx + 1}`}
                                className="size-full object-cover transition hover:opacity-90"
                              />
                              {idx === 2 && review.images.length > 3 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                                  +{review.images.length - 3}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button className="swiper-button-prev absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition hover:bg-gray-50">
              <ChevronLeft className="size-5" />
            </button>
            <button className="swiper-button-next absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition hover:bg-gray-50">
              <ChevronRight className="size-5" />
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500">Chưa có đánh giá nào</p>
        )}
      </div>

      {/* Image Gallery Modal */}
      {selectedImages && (
        <ImageGallery
          images={selectedImages}
          onClose={() => setSelectedImages(null)}
        />
      )}
    </section>
  );
}
