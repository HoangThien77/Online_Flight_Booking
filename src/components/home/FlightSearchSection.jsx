"use client";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  FaPlane,
  FaExchangeAlt,
  FaSearch,
  FaUser,
  FaCaretDown,
  FaCalendarAlt,
  FaSpinner,
} from "react-icons/fa";
import { format } from "date-fns";
import { startOfDay, addDays } from "date-fns";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MdAirlineSeatReclineExtra } from "react-icons/md";

import airportsData from "../../../public/airports.json";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { removeVietnameseTones } from "@/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
};

const splitText = (text) =>
  text.split("").map((char, i) => (
    <motion.span
      key={i}
      variants={itemVariants}
      style={{
        display: "inline-block",
        whiteSpace: char === " " ? "pre" : "normal",
      }}
    >
      {char}
    </motion.span>
  ));

export default function FlightSearchSection() {
  const [tripOption, setTripOption] = useState("Một chiều");
  const [from, setFrom] = useState("SGN, Hồ Chí Minh");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants_in_seat: 0,
    infants_on_lap: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOptionOpen, setDropdownOptionOpen] = useState(false);
  const [dropdownPassengersOpen, setDropdownPassengersOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [airportSuggestions, setAirportSuggestions] = useState([]);
  const [isFromFocused, setIsFromFocused] = useState(false);
  const [isToFocused, setIsToFocused] = useState(false);
  const [travelClass, setTravelClass] = useState("1");

  const optionDropdownRef = useRef(null);
  const passengersDropdownRef = useRef(null);
  const fromDropdownRef = useRef(null);
  const toDropdownRef = useRef(null);
  const router = useRouter();

  const getTotalPassengers = () => {
    return (
      passengers.adults +
      passengers.children +
      passengers.infants_in_seat +
      passengers.infants_on_lap
    );
  };

  const handleSwap = () => {
    const temp = from;

    setFrom(to);
    setTo(temp);
  };

  const handleAirportSearch = async (e, isFromField) => {
    const query = e.target.value.toLowerCase();
    const normalizedQuery = removeVietnameseTones(query);

    if (isFromField) {
      setFrom(e.target.value);
      setIsFromFocused(true);
      setIsToFocused(false);
    } else {
      setTo(e.target.value);
      setIsFromFocused(false);
      setIsToFocused(true);
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    const filteredAirports = airportsData
      .flatMap((region) => region.airports)
      .filter((airport) => {
        const airportNameNormalized = removeVietnameseTones(
          airport.name?.toLowerCase() || "",
        );
        const cityNormalized = removeVietnameseTones(
          airport.city?.toLowerCase() || "",
        );
        const countryNormalized = removeVietnameseTones(
          airport.country?.toLowerCase() || "",
        );
        const iataNormalized = airport.iata?.toLowerCase() || "";

        return (
          airportNameNormalized.includes(normalizedQuery) ||
          cityNormalized.includes(normalizedQuery) ||
          iataNormalized.includes(normalizedQuery) ||
          countryNormalized.includes(normalizedQuery)
        );
      });

    if (filteredAirports.length > 0) {
      setAirportSuggestions(filteredAirports);
    } else {
      setAirportSuggestions([{ iata: "", name: "Nothing found." }]);
    }
  };

  const selectAirport = (airport, isFromField) => {
    const selectedAirport = `${airport.iata}, ${airport.city}, ${airport.country}`;

    if (isFromField) {
      if (selectedAirport === to) {
        alert("Điểm đi và điểm đến không thể giống nhau.");
      } else {
        setFrom(selectedAirport);
        setIsFromFocused(false);
      }
    } else {
      if (selectedAirport === from) {
        alert("Điểm đi và điểm đến không thể giống nhau.");
      } else {
        setTo(selectedAirport);
        setIsToFocused(false);
      }
    }
    setAirportSuggestions([]);
  };

  const handlePassengerChange = (type, operation) => {
    setPassengers((prev) => {
      let newValue = prev[type];

      if (operation === "increase") {
        if (getTotalPassengers() < 9) {
          if (type === "adults" && newValue < 9) {
            newValue += 1;
          } else if (type === "children" && newValue < 8) {
            newValue += 1;
          } else if (type === "infants_in_seat" && newValue < 8) {
            newValue += 1;
          } else if (
            type === "infants_on_lap" &&
            newValue < passengers.adults
          ) {
            newValue += 1;
          } else if (
            type === "infants_on_lap" &&
            newValue >= passengers.adults
          ) {
            setErrorMessage(
              "Số lượng trẻ sơ sinh không được nhiều hơn số lượng người lớn",
            );

            return prev;
          }
        } else {
          setErrorMessage(
            "Số lượng hành khách không vượt quá 9 người trong một lần đặt chỗ",
          );
        }
      }

      if (operation === "decrease") {
        if (type === "adults" && newValue > 1) {
          if (passengers.infants_on_lap > newValue - 1) {
            setErrorMessage(
              "Số lượng trẻ sơ sinh không được ít hơn số lượng người lớn",
            );
          } else {
            newValue -= 1;
            setErrorMessage("");
          }
        } else if (type !== "adults" && newValue > 0) {
          newValue -= 1;
        }
      }

      return { ...prev, [type]: newValue };
    });
  };

  const toggleOptionDropdown = () => {
    setDropdownOptionOpen(!dropdownOptionOpen);
    if (dropdownPassengersOpen) setDropdownPassengersOpen(false);
  };

  const togglePassengersDropdown = () => {
    setDropdownPassengersOpen(!dropdownPassengersOpen);
    if (dropdownOptionOpen) setDropdownOptionOpen(false);
  };

  const handleClickOutside = (e) => {
    if (
      optionDropdownRef.current &&
      !optionDropdownRef.current.contains(e.target) &&
      passengersDropdownRef.current &&
      !passengersDropdownRef.current.contains(e.target) &&
      fromDropdownRef.current &&
      !fromDropdownRef.current.contains(e.target) &&
      toDropdownRef.current &&
      !toDropdownRef.current.contains(e.target)
    ) {
      setDropdownOptionOpen(false);
      setDropdownPassengersOpen(false);
      setIsFromFocused(false);
      setIsToFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDepartureDateSelect = (date) => {
    setDepartureDate(date);
    setReturnDate(null);
  };

  const handleReturnDateSelect = (range) => {
    setReturnDate(range?.to);
    if (range?.to) {
      setTripOption("Khứ hồi");
    } else {
      setTripOption("Một chiều");
    }
  };

  const handleSearch = async () => {
    if (from && to && departureDate) {
      setIsLoading(true);
      const fromCode = from.split(",")[0].trim();
      const toCode = to.split(",")[0].trim();

      const flightType = returnDate ? "1" : "2";
      const vietnamTimeZone = "Asia/Ho_Chi_Minh";
      const formattedOutboundDate = format(
        departureDate.setHours(0, 0, 0, 0),
        "yyyy-MM-dd",
        { timeZone: vietnamTimeZone },
      );
      const formattedReturnDate = returnDate
        ? format(returnDate.setHours(0, 0, 0, 0), "yyyy-MM-dd", {
            timeZone: vietnamTimeZone,
          })
        : "";

      const params = {
        engine: "google_flights",
        departure_id: fromCode,
        arrival_id: toCode,
        outbound_date: formattedOutboundDate,
        return_date: formattedReturnDate,
        travel_class: travelClass,
        currency: "VND",
        hl: "vi",
        gl: "vn",
        api_key:
          "a0cc736f9f199b8a669e59f245d76f23d3a58dba760c070d6100e8943e6eefdb",
        type: flightType,
        adults: passengers.adults,
        children: passengers.children,
        infants_in_seat: passengers.infants_in_seat,
        infants_on_lap: passengers.infants_on_lap,
      };

      console.log("Các tham số gửi đến API:", params);

      try {
        const response = await axios.get("/api/flights", { params });
        const searchId = Date.now().toString();

        localStorage.setItem(
          `flightData_${searchId}`,
          JSON.stringify(response.data),
        );
        router.push(
          `/flight-result?searchId=${searchId}&type=${flightType}&travel_class=${travelClass}&departure_id=${encodeURIComponent(fromCode)}&arrival_id=${encodeURIComponent(toCode)}&outbound_date=${formattedOutboundDate}&return_date=${formattedReturnDate}&engine=google_flights&currency=VND&hl=vi&gl=vn&api_key=a0cc736f9f199b8a669e59f245d76f23d3a58dba760c070d6100e8943e6eefdb&adults=${passengers.adults}&children=${passengers.children}&infants_in_seat=${passengers.infants_in_seat}&infants_on_lap=${passengers.infants_on_lap}`,
        );
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        alert("Không thể tìm kiếm chuyến bay. Vui lòng thử lại!");
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
      }
    } else {
      alert("Vui lòng điền đầy đủ thông tin điểm đi, điểm đến và ngày đi.");
    }
  };

  const videoSrc = "./videos/video-bg.mp4";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <>
      <div className="relative h-screen md:h-[800px]">
        <video
          autoPlay
          loop
          muted
          preload="auto"
          className="absolute left-0 top-0 z-0 size-full object-cover"
          src={videoSrc}
          style={{ filter: "grayscale(20%) brightness(60%)" }}
        />

        <div
          className="absolute inset-0 flex items-start justify-center pt-16 md:items-center md:pt-0"
          style={{ paddingBottom: "15%", paddingRight: "15%" }}
        >
          <motion.div
            className="px-4 text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="mb-4 text-lg font-light text-white sm:text-2xl md:text-5xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <span className="mb-2 block font-bold md:mb-0 md:inline">
                {splitText("KHÁM PHÁ")}
              </span>{" "}
              <span>{splitText("ĐIỂN ĐẾN")}</span>
            </motion.h1>
            <motion.p
              className="text-lg font-light text-white sm:text-2xl md:text-5xl"
              variants={itemVariants}
            >
              <span className="mb-2 block md:mb-0 md:inline">VÒNG QUANH</span>{" "}
              <motion.span
                className="block font-bold md:inline"
                variants={itemVariants}
              >
                THẾ GIỚI CÙNG CHÚNG TÔI
              </motion.span>
            </motion.p>
          </motion.div>
        </div>

        <div className="relative z-10 flex h-full items-end justify-center pb-4 md:items-center md:pb-0">
          <div className="mx-auto w-full max-w-7xl rounded-2xl bg-white bg-opacity-50 p-4 shadow-lg md:absolute md:bottom-[30%]">
            <div className="mb-4 flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
              <div onClick={toggleOptionDropdown} ref={optionDropdownRef}>
                <Select value={tripOption} onValueChange={setTripOption}>
                  <SelectTrigger className="w-[150px] bg-white">
                    <FaPlane className="mr-2 text-[18px] text-gray-500" />
                    <SelectValue placeholder="Chọn loại vé" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Một chiều">Một chiều</SelectItem>
                    <SelectItem value="Khứ hồi">Khứ hồi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div
                className="relative flex h-[38px] w-full cursor-pointer items-center rounded-lg bg-white p-3 md:w-auto"
                onClick={togglePassengersDropdown}
                ref={passengersDropdownRef}
              >
                <FaUser className="mr-2 text-gray-500" />
                <span className="flex items-center space-x-2 overflow-hidden text-black">
                  <span>{passengers.adults} Người lớn</span>
                  {passengers.children > 0 && (
                    <span>{passengers.children} Trẻ em</span>
                  )}
                  {passengers.infants_in_seat > 0 && (
                    <span>{passengers.infants_in_seat} Trẻ sơ sinh</span>
                  )}
                  {passengers.infants_on_lap > 0 && (
                    <span>
                      {passengers.infants_on_lap} Trẻ sơ sinh (lên đùi)
                    </span>
                  )}
                </span>
                <FaCaretDown className="ml-2 text-gray-500" />

                {dropdownPassengersOpen && (
                  <div className="absolute left-0 top-12 z-20 mt-1 w-full rounded-lg bg-white shadow-lg md:left-auto md:w-[300px]">
                    <div className="p-3">
                      <div className="mb-2 flex cursor-default items-center justify-between">
                        <span className="text-black">Người lớn</span>
                        <div className="flex items-center">
                          <button
                            className="cursor-pointer rounded bg-gray-300 px-4 py-1 text-black"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePassengerChange("adults", "decrease");
                            }}
                          >
                            -
                          </button>
                          <span className="mx-4 text-black">
                            {passengers.adults}
                          </span>
                          <button
                            className="cursor-pointer rounded bg-orange-500 px-4 py-1 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePassengerChange("adults", "increase");
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <hr className="my-2 border-gray-300" />

                      <div className="mb-2 flex cursor-default items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-black">Trẻ em</span>
                        </div>
                        <div className="flex items-center">
                          <button
                            className="cursor-pointer rounded bg-gray-300 px-4 py-1 text-black"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePassengerChange("children", "decrease");
                            }}
                          >
                            -
                          </button>
                          <span className="mx-4 text-black">
                            {passengers.children}
                          </span>
                          <button
                            className="cursor-pointer rounded bg-orange-500 px-4 py-1 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePassengerChange("children", "increase");
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <hr className="my-2 border-gray-300" />

                      <div className="mb-2 flex cursor-default items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-black">Trẻ sơ sinh có ghế</span>
                        </div>
                        <div className="flex items-center">
                          <button
                            className="cursor-pointer rounded bg-gray-300 px-4 py-1 text-black"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePassengerChange(
                                "infants_in_seat",
                                "decrease",
                              );
                            }}
                          >
                            -
                          </button>
                          <span className="mx-4 text-black">
                            {passengers.infants_in_seat}
                          </span>
                          <button
                            className="cursor-pointer rounded bg-orange-500 px-4 py-1 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePassengerChange(
                                "infants_in_seat",
                                "increase",
                              );
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <hr className="my-2 border-gray-300" />

                      <div className="mb-2 flex cursor-default items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-black">
                            Trẻ sơ sinh ngồi cùng người lớn
                          </span>
                        </div>
                        <div className="flex items-center">
                          <button
                            className="cursor-pointer rounded bg-gray-300 px-4 py-1 text-black"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePassengerChange(
                                "infants_on_lap",
                                "decrease",
                              );
                            }}
                          >
                            -
                          </button>
                          <span className="mx-4 text-black">
                            {passengers.infants_on_lap}
                          </span>
                          <button
                            className="cursor-pointer rounded bg-orange-500 px-4 py-1 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePassengerChange(
                                "infants_on_lap",
                                "increase",
                              );
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {errorMessage && (
                        <p className="mt-2 text-sm text-red-500">
                          {errorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Thêm dropdown cho travel_class */}

              <Select value={travelClass} onValueChange={setTravelClass}>
                <SelectTrigger className="w-[200px] bg-white">
                  <MdAirlineSeatReclineExtra className="mr-2 text-[22px] text-gray-500" />
                  <SelectValue placeholder="Chọn hạng ghế" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Economy</SelectItem>
                  <SelectItem value="2">Premium Economy</SelectItem>
                  <SelectItem value="3">Business</SelectItem>
                  <SelectItem value="4">First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(tripOption === "Một chiều" || tripOption === "Khứ hồi") && (
              <div className="mb-4 flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <div
                  className="relative w-full md:w-[22%]"
                  ref={fromDropdownRef}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                    className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-500"
                  >
                    <path
                      d="M381 114.9L186.1 41.8c-16.7-6.2-35.2-5.3-51.1 2.7L89.1 67.4C78 73 77.2 88.5 87.6 95.2l146.9 94.5L136 240 77.8 214.1c-8.7-3.9-18.8-3.7-27.3 .6L18.3 230.8c-9.3 4.7-11.8 16.8-5 24.7l73.1 85.3c6.1 7.1 15 11.2 24.3 11.2l137.7 0c5 0 9.9-1.2 14.3-3.4L535.6 212.2c46.5-23.3 82.5-63.3 100.8-112C645.9 75 627.2 48 600.2 48l-57.4 0c-20.2 0-40.2 4.8-58.2 14L381 114.9zM0 480c0 17.7 14.3 32 32 32l576 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 448c-17.7 0-32 14.3-32 32z"
                      fill="currentColor"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Khởi hành từ"
                    value={from.split(", ").slice(0, 2).join(", ")}
                    onChange={(e) => handleAirportSearch(e, true)}
                    className="w-full rounded-lg border bg-white p-3 pl-10 text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  {isFromFocused && from.length > 0 && (
                    <div className="absolute top-full z-20 mt-1 max-h-80 w-full overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg md:w-[400px]">
                      {airportSuggestions.map((airport) => (
                        <div
                          key={airport.iata}
                          className="cursor-pointer border-b border-gray-200 p-4 hover:bg-gray-100"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => selectAirport(airport, true)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-black">
                              {airport.city}, {airport.country}
                            </div>
                            <div className="text-sm text-gray-500">
                              {airport.iata}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            <FaPlane className="mr-2 inline-block text-gray-400" />
                            {airport.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={handleSwap} className="mx-2">
                  <FaExchangeAlt className="text-black-500" />
                </button>

                <div className="relative w-full md:w-[22%]" ref={toDropdownRef}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                    className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-500"
                  >
                    <path
                      d="M.3 166.9L0 68C0 57.7 9.5 50.1 19.5 52.3l35.6 7.9c10.6 2.3 19.2 9.9 23 20L96 128l127.3 37.6L181.8 20.4C178.9 10.2 186.6 0 197.2 0l40.1 0c11.6 0 22.2 6.2 27.9 16.3l109 193.8 107.2 31.7c15.9 4.7 30.8 12.5 43.7 22.8l34.4 27.6c24 19.2 18.1 57.3-10.7 68.2c-41.2 15.6-86.2 18.1-128.8 7L121.7 289.8c-11.1-2.9-21.2-8.7-29.3-16.9L9.5 189.4c-5.9-6-9.3-14.1-9.3-22.5zM32 448l576 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32zm96-80a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm128-16a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
                      fill="currentColor"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Nơi đến"
                    value={to.split(", ").slice(0, 2).join(", ")}
                    onChange={(e) => handleAirportSearch(e, false)}
                    className="w-full rounded-lg border bg-white p-3 pl-10 text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  {isToFocused && to.length > 0 && (
                    <div className="absolute top-full z-20 mt-1 max-h-80 w-full overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg md:w-[400px]">
                      {airportSuggestions.map((airport) => (
                        <div
                          key={airport.iata}
                          className="cursor-pointer border-b border-gray-200 p-4 hover:bg-gray-100"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => selectAirport(airport, false)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-black">
                              {airport.city}, {airport.country}
                            </div>
                            <div className="text-sm text-gray-500">
                              {airport.iata}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            <FaPlane className="mr-2 inline-block text-gray-400" />
                            {airport.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex h-[50px] w-[38%] items-center rounded-lg border bg-white p-3">
                  <FaCalendarAlt className="mr-2 text-gray-500" />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="departureDate"
                        variant={"ghost"}
                        className={cn(
                          "w-[50%] justify-start bg-transparent text-left text-base font-normal text-black focus:outline-none",
                          !departureDate && "text-muted-foreground",
                        )}
                      >
                        {departureDate
                          ? format(departureDate, "dd/MM/yyyy")
                          : "Chọn ngày đi"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={departureDate}
                        onSelect={handleDepartureDateSelect}
                        initialFocus
                        disabled={(date) => date < startOfDay(new Date())}
                      />
                    </PopoverContent>
                  </Popover>

                  <span className="mx-4 text-gray-400">|</span>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="returnDateRange"
                        variant={"ghost"}
                        className={cn(
                          "w-[50%] justify-start bg-transparent text-left text-base font-normal text-black focus:outline-none",
                          !returnDate && "text-muted-foreground",
                        )}
                        disabled={!departureDate}
                      >
                        {returnDate
                          ? format(returnDate, "dd/MM/yyyy")
                          : "Chọn ngày về"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="left">
                      <Calendar
                        mode="range"
                        defaultMonth={departureDate}
                        selected={{ from: departureDate, to: returnDate }}
                        onSelect={(range) => handleReturnDateSelect(range)}
                        disabled={(date) =>
                          date <=
                          startOfDay(addDays(departureDate || new Date(), 0))
                        }
                        numberOfMonths={2}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <button
                  onClick={handleSearch}
                  className="flex h-[50px] items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <FaSpinner className="mr-2 animate-spin" />
                  ) : (
                    <FaSearch className="mr-2" />
                  )}
                  {isLoading ? "Đang tìm kiếm..." : "Tìm kiếm"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
