"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

import BookingDetails from "../../my-bookings/components/BookingDetails";
import LoadingSpinner from "../../../../components/ui/Loading";

const fetchBookingDetails = async (pnrId) => {
  try {
    const response = await axios.post("/api/bookings/search", { pnrId: pnrId });

    return response.data; // Trả về dữ liệu từ API
  } catch (err) {
    throw new Error("Có lỗi xảy ra khi tải thông tin đặt chỗ.");
  }
};

const BookingSearchResult = () => {
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const pnrId = searchParams.get("pnr_id");

    if (!pnrId) {
      setError("PNR ID không hợp lệ");
      setLoading(false);

      return;
    }

    // Sử dụng hàm fetchBookingDetails để gọi API
    const getBookingDetails = async () => {
      try {
        const data = await fetchBookingDetails(pnrId); // Gọi hàm tách riêng

        setTimeout(() => {
          setBooking(data);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getBookingDetails();
  }, [searchParams]); // Khi `searchParams` thay đổi, useEffect sẽ được gọi lại

  // Hiển thị loading trong khi đang fetch data
  if (loading) return <LoadingSpinner />;

  // Hiển thị lỗi nếu có lỗi
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="h-[800px] items-center">
      {booking ? (
        <BookingDetails booking={booking} /> // Hiển thị chi tiết booking nếu có
      ) : (
        <p>Không tìm thấy thông tin đặt chỗ.</p>
      )}
    </div>
  );
};

export default BookingSearchResult;
