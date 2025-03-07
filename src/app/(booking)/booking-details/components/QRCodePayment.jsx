import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";

const QRCodePayment = ({
  qrCodeUrl,
  url,
  sessionId,
  onPaymentSuccess,
  onPaymentError,
  onClose,
}) => {
  const [countdown, setCountdown] = useState(900); // 15 phút
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (!sessionId) return;

    const checkStatus = async () => {
      if (checkingPayment) return;

      try {
        setCheckingPayment(true);
        const response = await fetch("/api/payments/check-payment-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          throw new Error("Failed to check payment status");
        }

        const data = await response.json();

        setStatus(data.status);

        if (data.status === "complete") {
          onPaymentSuccess?.();

          return true;
        }

        if (data.status === "failed") {
          onPaymentError?.("Thanh toán thất bại");

          return true;
        }

        return false;
      } catch (error) {
        console.error("Error checking payment status:", error);

        return false;
      } finally {
        setCheckingPayment(false);
      }
    };

    const paymentInterval = setInterval(async () => {
      const isComplete = await checkStatus();

      if (isComplete) {
        clearInterval(paymentInterval);
        clearInterval(countdownInterval);
      }
    }, 3000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(paymentInterval);
          clearInterval(countdownInterval);
          onPaymentError?.("Hết thời gian thanh toán");

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(paymentInterval);
      clearInterval(countdownInterval);
    };
  }, [sessionId, onPaymentSuccess, onPaymentError, checkingPayment]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <XCircle className="size-6" />
        </button>

        <div className="flex flex-col items-center">
          <h3 className="mb-6 text-xl font-semibold text-gray-900">
            Thanh toán bằng mã QR
          </h3>

          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="size-64 rounded-lg shadow-md"
              />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 shadow-md">
                <p className="text-sm font-medium text-gray-600">
                  {formatTime(countdown)}
                </p>
              </div>
            </div>

            <div className="mb-6 space-y-2 text-center">
              <p className="text-sm text-gray-600">
                Quét mã QR để thanh toán hoặc nhấn nút bên dưới
              </p>
              <p className="text-xs text-gray-500">
                Mã QR sẽ hết hạn sau {formatTime(countdown)}
              </p>
            </div>

            <div className="w-full space-y-4">
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                {status === "pending" && (
                  <p className="text-sm text-yellow-600">
                    Đang chờ thanh toán...
                  </p>
                )}
                {status === "processing" && (
                  <p className="text-sm text-blue-600">
                    Đang xử lý thanh toán...
                  </p>
                )}
                {status === "complete" && (
                  <p className="text-sm text-green-600">
                    Thanh toán thành công!
                  </p>
                )}
              </div>

              <button
                onClick={() => window.open(url, "_blank")}
                className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
              >
                Mở trang thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePayment;
