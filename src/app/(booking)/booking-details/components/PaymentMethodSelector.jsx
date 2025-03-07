import { Check } from "lucide-react";
import Image from "next/image";
import "../components/animations.css";

const PaymentMethodSelector = ({ selectedMethod, onMethodSelect }) => {
  const paymentMethods = [
    {
      id: "stripe",
      name: "Thẻ tín dụng/ghi nợ",
      description: "Thanh toán an toàn qua Visa, Master, JCB",
      icon: (
        <Image
          src="/icons/stripe.svg"
          alt="MoMo Icon"
          width={32}
          height={32}
          priority
        />
      ),
      gradientColors: "from-[#6772e5] to-[#4b58cc]",
      hoverGradient: "hover:bg-gradient-to-r from-[#6772e5]/5 to-[#4b58cc]/5",
    },
    {
      id: "momo",
      name: "Ví MoMo",
      description: "Thanh toán nhanh chóng qua ví điện tử MoMo",
      icon: (
        <Image
          src="/icons/momo_square_pinkbg.svg"
          alt="MoMo"
          width={32}
          height={32}
          priority
        />
      ),
      gradientColors: "from-[#d82d8b] to-[#b4256f]",
      hoverGradient: "hover:bg-gradient-to-r from-[#d82d8b]/5 to-[#b4256f]/5",
    },
    {
      id: "stripe_qr",
      name: "QR Code",
      description: "Quét mã QR để thanh toán qua ứng dụng ngân hàng",
      icon: (
        <Image
          src="/icons/qr-icon.png"
          alt="QR Code"
          width={32}
          height={32}
          priority
        />
      ),
      gradientColors: "from-[#4f46e5] to-[#3730a3]",
      hoverGradient: "hover:bg-gradient-to-r from-[#4f46e5]/5 to-[#3730a3]/5",
    },
  ];

  return (
    <div className="relative mt-8 space-y-4">
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-blue-50 opacity-50" />

      {/* Payment Methods */}
      <div className="grid gap-4">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onMethodSelect(method.id)}
            className={`group relative flex w-full items-center rounded-xl border-2 p-4 transition-all duration-300 ease-in-out ${method.hoverGradient} ${
              selectedMethod === method.id
                ? "border-blue-500 bg-blue-50/30 ring-2 ring-blue-200"
                : "border-gray-200 bg-white hover:border-blue-200"
            } `}
          >
            {/* Icon Container */}
            <div
              className={`mr-4 flex size-14 items-center justify-center rounded-xl bg-gradient-to-br ${method.gradientColors} p-3 shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl`}
            >
              <div className="rounded-lg bg-white p-1">{method.icon}</div>
            </div>

            {/* Content */}
            <div className="flex-1 text-left">
              <p className="font-semibold tracking-wide text-gray-900 transition-colors group-hover:text-blue-600">
                {method.name}
              </p>
              <p className="mt-1 text-sm text-gray-500">{method.description}</p>
            </div>

            {/* Checkbox */}
            <div
              className={`ml-4 flex size-6 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                selectedMethod === method.id
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-300 group-hover:border-blue-300"
              } `}
            >
              <Check
                className={`size-4 transition-all duration-300 ${selectedMethod === method.id ? "opacity-100" : "opacity-0"} `}
              />
            </div>

            {/* Selection Indicator */}
            {selectedMethod === method.id && (
              <div className="animate-appear absolute -inset-px -z-10 rounded-xl bg-gradient-to-r from-blue-50 to-blue-50/50" />
            )}
          </button>
        ))}
      </div>

      {/* Payment Details Card */}
      {selectedMethod && (
        <div className="animate-slideUp rounded-xl bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="rounded-full bg-blue-100 p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {selectedMethod === "stripe" &&
                  "Hỗ trợ thanh toán qua các loại thẻ Visa, Master Card, JCB và American Express"}
                {selectedMethod === "momo" &&
                  "Vui lòng đảm bảo bạn đã cài đặt và đăng nhập ứng dụng MoMo trên điện thoại"}
                {selectedMethod === "stripe_qr" &&
                  "Sử dụng ứng dụng ngân hàng hỗ trợ quét mã QR để thanh toán nhanh chóng và an toàn"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-6 rounded-xl bg-gradient-to-br from-green-50 via-white to-green-50 p-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="rounded-full bg-green-100 p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              Thanh toán An toàn & Bảo mật
            </h4>
            <p className="mt-1 text-sm text-gray-500">
              Thông tin thanh toán của bạn được bảo vệ và mã hóa theo tiêu chuẩn
              quốc tế
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
