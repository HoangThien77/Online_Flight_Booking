"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaTimesCircle } from "react-icons/fa";

export default function PaymentCancel() {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const session_id = searchParams.get("session_id");
    const bookingId = searchParams.get("bookingId");

    if (bookingId) {
      const updatePaymentStatus = async () => {
        try {
          const response = await fetch("/api/payments/update-status", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bookingId: parseInt(bookingId),
              status: "cancelled",
              paymentMethod: session_id ? "stripe" : "momo", // Xác định payment method dựa vào session_id
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();

            console.error("Error response:", errorData);
            throw new Error(
              errorData.error || "Failed to update payment status",
            );
          }

          const data = await response.json();

          console.log("Success response:", data);
          setLoading(false);
        } catch (error) {
          console.error("Error in updatePaymentStatus:", error);
          setErrorMessage(
            error.message ||
              "Đã xảy ra lỗi khi cập nhật trạng thái thanh toán.",
          );
          setLoading(false);
        }
      };

      updatePaymentStatus();
    } else {
      setErrorMessage("Không tìm thấy mã đặt vé.");
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="mb-4 size-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-600">Đang xử lý yêu cầu...</p>
          </div>
        ) : errorMessage ? (
          <div className="text-center">
            <FaTimesCircle className="mx-auto mb-4 text-4xl text-red-500" />
            <p className="text-red-500">{errorMessage}</p>
            <button
              className="mt-6 rounded bg-blue-500 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-700"
              onClick={() => router.push("/")}
            >
              Quay về trang chủ
            </button>
          </div>
        ) : (
          <div className="text-center">
            <FaTimesCircle className="mx-auto mb-4 text-4xl text-red-500" />
            <h1 className="mb-4 text-xl font-bold text-gray-900">
              Thanh toán không thành công
            </h1>
            <p className="mb-6 text-gray-600">
              Phiên thanh toán của bạn đã bị hủy hoặc thất bại. Vui lòng thử lại
              sau hoặc chọn phương thức thanh toán khác.
            </p>
            <div className="space-y-4">
              <button
                className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-700"
                onClick={() => router.back()}
              >
                Thử lại
              </button>
              <button
                className="w-full rounded border border-gray-300 bg-white px-4 py-2 font-bold text-gray-700 transition-colors hover:bg-gray-50"
                onClick={() => router.push("/")}
              >
                Quay về trang chủ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
