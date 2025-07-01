"use client";
import { motion } from "framer-motion";
import { X, Share2, Plane, Clock, Calendar } from "lucide-react";

const ReviewFlightSection = ({
  outbound,
  inbound,
  totalPrice,
  onContinue,
  onClose,
}) => {
  const mainFlight = outbound?.flights?.[0];

  const FlightCard = ({ flight, type, label }) => (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg">
      {/* Type Badge */}
      <div className="absolute right-4 top-4">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
            type === "outbound"
              ? "bg-blue-100 text-blue-700"
              : "bg-purple-100 text-purple-700"
          }`}
        >
          <Plane size={12} />
          {label}
        </span>
      </div>

      {/* Route Header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <span className="text-sm text-gray-600">{flight.dateLabel}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          {flight.flights[0].departure_airport.city_name} →{" "}
          {flight.flights.at(-1).arrival_airport.city_name}
        </h3>
      </div>

      {/* Airline Info */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-white shadow-md">
          <img
            className="size-8 object-contain"
            src={flight.flights[0].airline_logo || "/api/placeholder/32/32"}
            alt="Airline"
          />
        </div>
        <div>
          <p className="font-semibold text-gray-900">
            {flight.flights[0].airline_name}
          </p>
          <p className="text-sm text-gray-500">
            {flight.flights[0].flight_number}
          </p>
        </div>
      </div>

      {/* Flight Timeline */}
      <div className="mb-6 flex items-center justify-between">
        {/* Departure */}
        <div className="text-center">
          <div className="mb-1 text-2xl font-bold text-gray-900">
            {flight.flights[0].departure_airport.time.split(" ")[1]}
          </div>
          <div className="mb-1 text-sm font-medium text-gray-600">
            {flight.flights[0].departure_airport.id}
          </div>
          <div className="text-xs text-gray-500">
            {flight.flights[0].departure_airport.city_name}
          </div>
        </div>

        {/* Flight Path */}
        <div className="mx-6 flex-1">
          <div className="mb-2 flex items-center justify-center">
            <Clock size={14} className="mr-1 text-gray-400" />
            <span className="text-sm text-gray-500">{flight.duration}</span>
          </div>
          <div className="relative">
            <div className="h-0.5 w-full bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="size-3 rounded-full bg-blue-500"></div>
            </div>
          </div>
          <div className="mt-2 text-center">
            <span className="rounded-full border bg-white px-2 py-1 text-xs text-gray-500">
              Bay thẳng
            </span>
          </div>
        </div>

        {/* Arrival */}
        <div className="text-center">
          <div className="mb-1 text-2xl font-bold text-gray-900">
            {flight.flights.at(-1).arrival_airport.time.split(" ")[1]}
          </div>
          <div className="mb-1 text-sm font-medium text-gray-600">
            {flight.flights.at(-1).arrival_airport.id}
          </div>
          <div className="text-xs text-gray-500">
            {flight.flights.at(-1).arrival_airport.city_name}
          </div>
        </div>
      </div>

      {/* Promo Tags */}
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
          🔥 BAY77NOIDIA -77K
        </span>
        <span className="inline-flex items-center rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
          ✈️ BAYCUNGANHLONG -300K
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="fixed inset-y-4 right-4 z-50 flex h-[calc(100%-2rem)] w-[95%] max-w-[650px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl sm:right-2 sm:w-[650px]"
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 25 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Xem lại chuyến bay
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Kiểm tra thông tin trước khi đặt vé
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-full p-2 transition-colors hover:bg-white/50">
              <Share2 size={18} className="text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-2 transition-colors hover:bg-white/50"
            >
              <X size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Outbound Flight */}
          <FlightCard flight={outbound} type="outbound" label="Khởi hành" />

          {/* Return Flight */}
          {inbound && (
            <FlightCard flight={inbound} type="inbound" label="Chuyến về" />
          )}

          {/* Trip Summary */}
          <div className="rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 to-yellow-50 p-6">
            <h4 className="mb-3 font-semibold text-gray-900">
              Tóm tắt chuyến đi
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Loại vé:</span>
                <span className="font-medium">
                  {inbound ? "Khứ hồi" : "Một chiều"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng thời gian bay:</span>
                <span className="font-medium">
                  {outbound.duration}
                  {inbound ? ` + ${inbound.duration}` : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hãng hàng không:</span>
                <span className="font-medium">
                  {outbound.flights[0].airline_name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50/50 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-gray-600">Tổng giá vé</p>
              <p className="text-2xl font-bold text-orange-600">
                {totalPrice?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }) || "0 ₫"}
                <span className="ml-1 text-sm font-normal text-gray-500">
                  /khách
                </span>
              </p>
            </div>
            <button
              onClick={onContinue}
              className="rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-orange-600 hover:to-red-600"
            >
              Tiếp tục đặt vé
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ReviewFlightSection;
