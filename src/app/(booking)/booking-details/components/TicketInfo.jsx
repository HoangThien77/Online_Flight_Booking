import React from "react";

export default function TicketInfo({
  flightType,
  flightDetails,
  totalPrice,
  passengersInfo,
}) {
  // Tách hành khách theo loại
  const adultPassengers =
    passengersInfo?.filter((p) => p.type === "adult") || [];
  const childPassengers =
    passengersInfo?.filter((p) => p.type === "child") || [];
  const infantPassengers =
    passengersInfo?.filter((p) => p.type === "infant") || [];

  // Tính tổng giá vé dựa trên loại vé (một chiều/khứ hồi)
  const oneWayTotal = flightDetails.outbound?.price || 0;
  const returnTotal =
    flightType === "1" && flightDetails.return ? flightDetails.return.price : 0;
  const finalTotal = oneWayTotal + returnTotal;

  // Tính tổng giá vé cho mỗi loại hành khách
  const totalPassengerPrice =
    flightType === "1" && flightDetails.return
      ? (flightDetails.outbound?.price || 0) +
        (flightDetails.return?.price || 0)
      : flightDetails.outbound?.price || 0;

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
      {/* Header Section với Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
        <h2 className="text-xl font-bold">Chi Tiết Đặt Vé</h2>
        <p className="mt-1 text-sm text-blue-100">
          Thông tin hành lý và giá vé
        </p>
      </div>

      <div className="p-6">
        {/* Thông Tin Hành Lý Section */}
        <div className="mb-8">
          <div className="mb-4 flex items-center">
            <svg
              className="mr-3 size-5 text-blue-600"
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
            <h3 className="text-lg font-semibold text-gray-800">
              Thông Tin Hành Lý
            </h3>
          </div>

          {/* Hành Khách Cards */}
          {adultPassengers.length > 0 && (
            <div className="mb-4 rounded-lg bg-gray-50 p-4">
              <h4 className="mb-3 font-medium text-gray-700">
                Người lớn (Hành khách{" "}
                {adultPassengers.map((_, i) => i + 1).join(", ")})
              </h4>
              <div className="space-y-3">
                {/* Hành lý ký gửi */}
                <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm">
                  <div className="flex items-center">
                    <div className="flex size-8 items-center justify-center rounded-full bg-green-100">
                      <svg
                        className="size-4 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Hành lý ký gửi
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      20kg
                    </span>
                    <div className="text-black-800 ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium">
                      1
                    </div>
                  </div>
                </div>

                {/* Hành lý xách tay */}
                <div className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm">
                  <div className="flex items-center">
                    <div className="flex size-8 items-center justify-center rounded-full bg-orange-100">
                      <svg
                        className="size-4 text-orange-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Hành lý xách tay
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      7kg
                    </span>
                    <div className="text-black-800 ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium">
                      1
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trẻ em/Em bé Card */}
          {(childPassengers.length > 0 || infantPassengers.length > 0) && (
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="mb-3 font-medium text-gray-700">
                Trẻ em/Em bé (Hành khách{" "}
                {[...childPassengers, ...infantPassengers]
                  .map((_, i) => i + 1 + adultPassengers.length)
                  .join(", ")}
                )
              </h4>
              <div className="space-y-2 rounded-md bg-white p-3 text-sm text-gray-600">
                <p className="flex items-center">
                  <svg
                    className="mr-2 size-4 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Hành lý ký gửi: 1 kiện (15kg)
                </p>
                <p className="flex items-center">
                  <svg
                    className="mr-2 size-4 text-blue-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Hành lý xách tay: 1 kiện (5kg)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Chi Tiết Giá Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Chi Tiết Giá
            </h3>
            <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              {flightType === "1" && flightDetails.return
                ? "Khứ hồi"
                : "Một chiều"}
            </div>
          </div>

          {/* Giá vé chi tiết */}
          <div className="space-y-3">
            <div className="flex justify-between rounded-lg bg-gray-50 p-3">
              <div className="text-sm text-gray-600">
                Hành khách ({adultPassengers.length} người lớn
                {childPassengers.length
                  ? `, ${childPassengers.length} trẻ em`
                  : ""}
                {infantPassengers.length
                  ? `, ${infantPassengers.length} em bé`
                  : ""}
                )
              </div>
              <div className="font-medium text-gray-900">
                {totalPassengerPrice.toLocaleString()} đ
              </div>
            </div>

            {flightDetails.outbound && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Giá vé chiều đi</span>
                <span>{flightDetails.outbound.price.toLocaleString()} đ</span>
              </div>
            )}

            {/* Chỉ hiển thị giá vé chiều về khi là vé khứ hồi và có thông tin chuyến về */}
            {flightType === "1" && flightDetails.return && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Giá vé chiều về</span>
                <span>{flightDetails.return.price.toLocaleString()} đ</span>
              </div>
            )}

            <div className="flex justify-between text-sm text-gray-600">
              <span>Thuế và phí</span>
              <span className="text-green-600">Đã bao gồm</span>
            </div>
          </div>

          {/* Total Price Section */}
          <div className="mt-6 rounded-lg bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">
                Tổng tiền
              </span>
              <span className="text-xl font-bold text-blue-600">
                {finalTotal.toLocaleString()} đ
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              * Giá đã bao gồm thuế và phí
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
