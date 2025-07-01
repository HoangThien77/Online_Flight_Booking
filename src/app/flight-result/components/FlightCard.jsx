import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  FaPlane,
  FaChevronDown,
  FaChevronUp,
  FaSuitcase,
  FaExchangeAlt,
} from "react-icons/fa";

import { formatDuration } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function FlightCard({
  flight,
  onSelect,
  leg,
  isSelectedFlight,
  onChangeFlight,
  loading,
}) {
  const [showMore, setShowMore] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const toggleShowMore = () => setShowMore((prev) => !prev);

  const handleFlightSelection = () => {
    if (onSelect) onSelect();
    else if (onChangeFlight) onChangeFlight();
  };

  const mainFlight = flight?.flights[0];
  const lastFlight = flight?.flights[flight?.flights.length - 1];

  const containerVariants = {
    hidden: { height: 0, opacity: 0, y: -20 },
    visible: {
      height: "auto",
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 25,
        mass: 1,
        duration: 0.8,
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      y: -20,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 25,
        mass: 1,
        duration: 0.8,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 8px 32px rgba(37,99,235,0.15)",
        y: -4,
        transition: {
          type: "spring",
          stiffness: 350,
          damping: 22,
          mass: 0.9,
        },
      }}
      className="mx-auto mb-6 w-full max-w-6xl cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
    >
      {loading || !flight ? (
        <div className="p-6">
          <div className="grid grid-cols-12 items-center gap-6">
            {/* Airline Logo & Info Skeleton */}
            <div className="col-span-3">
              <div className="flex items-center gap-4">
                <Skeleton className="size-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24 rounded" />
                  <Skeleton className="mt-2 h-4 w-20 rounded" />
                </div>
              </div>
            </div>

            {/* Flight Times & Route Skeleton */}
            <div className="col-span-6">
              <div className="flex items-center justify-between px-6">
                <div className="w-24 text-center">
                  <Skeleton className="mx-auto h-8 w-20 rounded-lg" />
                  <Skeleton className="mx-auto mt-2 h-5 w-24 rounded" />
                </div>
                <div className="flex flex-col items-center px-4">
                  <Skeleton className="mb-3 h-4 w-16 rounded" />
                  <Skeleton className="h-8 w-28 rounded-lg" />
                  <Skeleton className="mt-2 h-4 w-20 rounded" />
                </div>
                <div className="w-24 text-center">
                  <Skeleton className="mx-auto h-8 w-20 rounded-lg" />
                  <Skeleton className="mx-auto mt-2 h-5 w-24 rounded" />
                </div>
              </div>
            </div>

            {/* Price & Action Skeleton */}
            <div className="col-span-3 flex flex-col items-end justify-center">
              <Skeleton className="mb-2 h-8 min-w-[150px] rounded-lg" />
              <Skeleton className="mb-2 h-4 w-20 rounded" />
              <Skeleton className="mb-3 h-4 w-24 rounded" />
              <Skeleton className="h-10 w-36 rounded-full" />
            </div>
          </div>
          <div className="flex justify-center bg-gray-50 p-4">
            <Skeleton className="h-6 w-36 rounded-lg" />
          </div>
        </div>
      ) : (
        <div>
          <div className="p-6">
            <div className="grid grid-cols-12 items-center gap-6">
              {/* Airline Logo & Info */}
              <div className="col-span-3">
                <div className="flex items-center gap-4">
                  <div className="flex size-14 items-center justify-center rounded-full bg-white p-2 shadow-md">
                    <img
                      className="size-10 object-contain"
                      src={mainFlight.airline_logo}
                      alt={`Logo ${mainFlight.airline}`}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {mainFlight.airline}
                    </p>
                    <p className="text-sm text-gray-500">
                      {mainFlight.flight_number}
                    </p>
                  </div>
                </div>
              </div>

              {/* Flight Times & Route */}
              <div className="col-span-6">
                <div className="flex items-center justify-between px-6">
                  {/* Departure */}
                  <div className="w-24 text-center">
                    <p className="text-xl font-bold text-gray-800">
                      {mainFlight.departure_airport.time.split(" ")[1]}
                    </p>
                    <p className="text-base font-medium text-gray-600">
                      {mainFlight.departure_airport.id}
                    </p>
                  </div>

                  {/* Duration & Flight Path with Dashed Line */}
                  <div className="flex flex-col items-center px-4">
                    <p className="mb-1 text-sm text-gray-500">
                      {formatDuration(
                        flight.flights.reduce(
                          (acc, seg) => acc + seg.duration,
                          0,
                        ),
                      )}
                    </p>
                    <div className="relative flex items-center">
                      <div className="h-px w-14 border-t-2 border-dashed border-gray-300"></div>
                      <div className="relative z-10 mx-2 flex size-6 items-center justify-center rounded-full bg-blue-500">
                        <FaPlane className="size-3 text-white" />
                      </div>
                      <div className="h-px w-14 border-t-2 border-dashed border-gray-300"></div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {flight.flights.length > 1 ? "Quá cảnh" : "Bay thẳng"}
                    </p>
                  </div>

                  {/* Arrival */}
                  <div className="w-24 text-center">
                    <p className="text-xl font-bold text-gray-800">
                      {lastFlight.arrival_airport.time.split(" ")[1]}
                    </p>
                    <p className="text-base font-medium text-gray-600">
                      {lastFlight.arrival_airport.id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="col-span-3 flex flex-col items-end justify-center">
                <p className="mb-1 text-xl font-bold text-gray-800">
                  {flight.price
                    ? flight.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                    : "Không có giá"}
                </p>
                <p className="mb-1 text-sm text-gray-500">
                  {leg === "outbound" ? "Chuyến đi" : "Chuyến về"}
                </p>
                <p className="mb-2 text-sm text-gray-500">
                  Số ghế trống: {flight.availableSeats}
                </p>
                <button
                  onClick={handleFlightSelection}
                  className={`rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300 ${
                    isSelectedFlight
                      ? "border-2 border-blue-600 bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-yellow-500 text-white hover:bg-yellow-600"
                  }`}
                >
                  {isSelectedFlight ? "Thay đổi lựa chọn" : "Chọn chuyến bay"}
                </button>
              </div>
            </div>
          </div>
          <AnimatePresence>
            {showMore && (
              <motion.div
                className="overflow-hidden rounded-lg bg-white"
                layout
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
              >
                <div className="p-6">
                  <motion.div
                    className="w-full"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={contentVariants}
                  >
                    <h3 className="mb-6 text-xl font-semibold text-gray-800">
                      Chi tiết chuyến bay
                    </h3>
                    <div className="relative">
                      {flight.flights.map((segment, index) => (
                        <div key={index}>
                          <div className="mb-8 flex items-start">
                            <div className="relative">
                              <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
                                <FaPlane className="size-5 text-blue-600" />
                              </div>
                              <div className="absolute bottom-0 left-1/2 top-10 h-20 w-0.5 bg-gray-200" />
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {segment.departure_airport.name} (
                                    {segment.departure_airport.id})
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {segment.departure_time}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-gray-700">
                                    {segment.airline}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {segment.flight_number}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2 text-sm text-gray-600">
                                Thời gian bay:{" "}
                                {formatDuration(segment.duration)}
                              </div>
                            </div>
                          </div>
                          {index < flight.flights.length - 1 && (
                            <div className="mb-8 ml-5 flex items-start">
                              <div className="z-10 -ml-4 flex size-8 items-center justify-center rounded-full bg-yellow-100">
                                <div className="size-4 rounded-full bg-yellow-400" />
                              </div>
                              <div className="ml-4">
                                <p className="text-sm text-yellow-600">
                                  Quá cảnh tại {segment.arrival_airport.name} (
                                  {segment.arrival_airport.id})
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="flex items-start">
                        <div className="z-10 ml-1 flex size-8 items-center justify-center rounded-full bg-green-100">
                          <div className="size-3 rounded-full bg-green-600" />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {lastFlight.arrival_airport.name} (
                                {lastFlight.arrival_airport.id})
                              </h4>
                              <p className="text-sm text-gray-500">
                                {lastFlight.arrival_time}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 grid grid-cols-1 gap-6 border-t border-gray-200 pt-8 md:grid-cols-2">
                      <div className="flex items-start space-x-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                          <FaExchangeAlt className="size-5 text-blue-600" />
                        </div>
                        <div>
                          <h5 className="mb-2 font-medium text-gray-900">
                            Chính sách hoàn tiền
                          </h5>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li>Tuân theo chính sách của hãng hàng không</li>
                            <li>Hoàn tiền = Phí + phí tiện ích</li>
                            <li>Đổi ngày = Phí + phí tiện ích</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                          <FaSuitcase className="size-5 text-blue-600" />
                        </div>
                        <div>
                          <h5 className="mb-2 font-medium text-gray-900">
                            Hành lý cho phép
                          </h5>
                          <p className="text-sm text-gray-600">
                            {mainFlight.departure_airport.id} -{" "}
                            {lastFlight.arrival_airport.id}: 20KG / người
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex justify-center bg-gray-50 p-4">
            <button
              className="flex items-center font-medium text-gray-500 transition-colors duration-300 hover:text-blue-600"
              onClick={toggleShowMore}
            >
              {showMore ? "Ẩn chi tiết" : "Xem thêm chi tiết"}
              {showMore ? (
                <FaChevronUp className="ml-2" />
              ) : (
                <FaChevronDown className="ml-2" />
              )}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
