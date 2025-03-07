"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  FaPlane,
  FaExchangeAlt,
  FaCalendarAlt,
  FaSearch,
  FaUser,
  FaChevronDown,
  FaSpinner,
} from "react-icons/fa";
import { MdAirlineSeatReclineExtra } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

import airportsData from "@/data/airports.json";
import { removeVietnameseTones } from "@/utils";

export default function ChangeSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [seatClass, setSeatClass] = useState("economy");
  const [tripOption, setTripOption] = useState("Một chiều");
  const [isSeatClassOpen, setIsSeatClassOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants_in_seat: 0,
    infants_on_lap: 0,
  });
  const [travelClass, setTravelClass] = useState("1");

  const [dropdownOptionOpen, setDropdownOptionOpen] = useState(false);
  const [dropdownPassengersOpen, setDropdownPassengersOpen] = useState(false);
  const [airportSuggestions, setAirportSuggestions] = useState([]);
  const [isFromFocused, setIsFromFocused] = useState(false);
  const [isToFocused, setIsToFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fromDropdownRef = useRef(null);
  const toDropdownRef = useRef(null);

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
      setAirportSuggestions([{ iata: "", name: "Không tìm thấy kết quả" }]);
    }
  };

  const selectAirport = (airport, isFromField) => {
    const selectedAirport = `${airport.iata}, ${airport.city}`;

    if (isFromField) {
      if (selectedAirport === to) {
        setErrorMessage("Điểm đi và điểm đến không thể giống nhau.");
      } else {
        setFrom(selectedAirport);
        setIsFromFocused(false);
        setErrorMessage("");
      }
    } else {
      if (selectedAirport === from) {
        setErrorMessage("Điểm đi và điểm đến không thể giống nhau.");
      } else {
        setTo(selectedAirport);
        setIsToFocused(false);
        setErrorMessage("");
      }
    }
    setAirportSuggestions([]);
  };

  const handlePassengerChange = (type, operation) => {
    setPassengers((prev) => {
      let newValue = prev[type];

      if (operation === "increase") {
        if (getTotalPassengers() < 9) {
          newValue += 1;
        } else {
          setErrorMessage(
            "Số lượng hành khách không vượt quá 9 người trong một lần đặt chỗ",
          );

          return prev;
        }
      }

      if (operation === "decrease") {
        if (newValue > 0) {
          newValue -= 1;
        }
      }

      setErrorMessage("");

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

  const handleReturnDateChange = (date) => {
    setReturnDate(date);
    if (date && tripOption === "Một chiều") {
      setTripOption("Khứ hồi");
    } else if (!date && tripOption === "Khứ hồi") {
      setTripOption("Một chiều");
    }
  };

  const handleSearch = () => {
    if (from && to && departureDate) {
      setIsLoading(true);
      const fromCode = from.split(",")[0].trim();
      const toCode = to.split(",")[0].trim();
      const flightType = returnDate ? "1" : "2";
      const formattedOutboundDate = format(departureDate, "yyyy-MM-dd");
      const formattedReturnDate = returnDate
        ? format(returnDate, "yyyy-MM-dd")
        : "";

      const travel_class =
        seatClass === "economy"
          ? "1"
          : seatClass === "premium_economy"
            ? "2"
            : seatClass === "business"
              ? "3"
              : seatClass === "first"
                ? "4"
                : "1";

      router.push(
        `/flight-result?engine=google_flights&departure_id=${encodeURIComponent(
          fromCode,
        )}&arrival_id=${encodeURIComponent(
          toCode,
        )}&outbound_date=${formattedOutboundDate}&return_date=${formattedReturnDate}&currency=VND&hl=vi&gl=vn&api_key=e03abb5be37ed80732bccb9539d1c81afff47ad32c3e1f2c94c06deab673afab&type=${flightType}&travel_class=${travel_class}&adults=${
          passengers.adults
        }&children=${passengers.children}&infants_in_seat=${
          passengers.infants_in_seat
        }&infants_on_lap=${passengers.infants_on_lap}`,
      );

      setTimeout(() => setIsLoading(false), 1000);
    } else {
      setErrorMessage(
        "Vui lòng điền đầy đủ thông tin điểm đi, điểm đến và ngày đi.",
      );
    }
  };

  useEffect(() => {
    const departure_id = searchParams.get("departure_id");
    const arrival_id = searchParams.get("arrival_id");
    const outbound_date = searchParams.get("outbound_date");
    const return_date = searchParams.get("return_date");
    const travel_class = searchParams.get("travel_class");
    const adults = searchParams.get("adults");
    const children = searchParams.get("children");
    const infants_in_seat = searchParams.get("infants_in_seat");
    const infants_on_lap = searchParams.get("infants_on_lap");

    if (departure_id) setFrom(departure_id);
    if (arrival_id) setTo(arrival_id);
    if (outbound_date) setDepartureDate(new Date(outbound_date));
    if (return_date) {
      setReturnDate(new Date(return_date));
      setTripOption("Khứ hồi");
    }
    if (travel_class) {
      setTravelClass(travel_class);
      setSeatClass(
        travel_class === "1"
          ? "economy"
          : travel_class === "2"
            ? "premium_economy"
            : travel_class === "3"
              ? "business"
              : travel_class === "4"
                ? "first"
                : "economy",
      );
    }
    if (adults || children || infants_in_seat || infants_on_lap) {
      setPassengers({
        adults: parseInt(adults) || 1,
        children: parseInt(children) || 0,
        infants_in_seat: parseInt(infants_in_seat) || 0,
        infants_on_lap: parseInt(infants_on_lap) || 0,
      });
    }
  }, [searchParams]);

  return (
    <div className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-full bg-white p-4 shadow-md">
      {/* Điểm đi và điểm đến */}
      <div className="flex items-center space-x-2">
        <div className="relative w-[150px]" ref={fromDropdownRef}>
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
            placeholder="Điểm đi"
            value={from}
            onChange={(e) => handleAirportSearch(e, true)}
            onBlur={() => setIsFromFocused(false)}
            onFocus={() => setIsFromFocused(true)}
            className="w-full rounded-full border border-gray-300 p-2 pl-10"
          />
          {isFromFocused && from.length > 0 && (
            <div className="absolute top-full z-20 mt-1 max-h-80 w-[400px] overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg">
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
                    <div className="text-sm text-gray-500">{airport.iata}</div>
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

        <FaExchangeAlt
          onClick={handleSwap}
          className="cursor-pointer text-gray-500"
        />

        <div className="relative w-[150px]" ref={toDropdownRef}>
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
            placeholder="Điểm đến"
            value={to}
            onChange={(e) => handleAirportSearch(e, false)}
            onBlur={() => setIsToFocused(false)}
            onFocus={() => setIsToFocused(true)}
            className="w-full rounded-full border border-gray-300 p-2 pl-10"
          />
          {isToFocused && to.length > 0 && (
            <div className="absolute top-full z-20 mt-1 max-h-80 w-[400px] overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg">
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
                    <div className="text-sm text-gray-500">{airport.iata}</div>
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
      </div>

      {/* Ngày đi và Ngày về */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <FaCalendarAlt className="mr-2 text-gray-500" />
          <DatePicker
            selected={departureDate}
            onChange={(date) => setDepartureDate(date)}
            placeholderText="Ngày đi"
            className="w-[100px] bg-transparent focus:outline-none"
          />
          {tripOption === "Khứ hồi" && (
            <>
              <span className="mx-2 text-gray-500">|</span>
              <FaCalendarAlt className="mr-2 text-gray-500" />
              <DatePicker
                selected={returnDate}
                onChange={(date) => handleReturnDateChange(date)}
                placeholderText="Ngày về"
                className="w-[100px] bg-transparent focus:outline-none"
              />
            </>
          )}
        </div>

        {/* Loại vé */}
        <div className="relative">
          <div
            onClick={toggleOptionDropdown}
            className="flex w-full items-center justify-between gap-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:from-blue-100 hover:to-indigo-100 md:w-auto"
          >
            <span>{tripOption}</span>
            <FaChevronDown
              className={`text-gray-400 transition-transform ${dropdownOptionOpen ? "rotate-180" : ""}`}
            />
          </div>

          {dropdownOptionOpen && (
            <div className="absolute z-10 mt-2 rounded-lg bg-white shadow-md">
              <div
                onClick={() => setTripOption("Một chiều")}
                className="cursor-pointer px-4 py-2 hover:bg-gray-200"
              >
                Một chiều
              </div>
              <div
                onClick={() => setTripOption("Khứ hồi")}
                className="cursor-pointer px-4 py-2 hover:bg-gray-200"
              >
                Khứ hồi
              </div>
            </div>
          )}
        </div>

        {/* Chọn hạng ghế */}
        <div className="relative flex-1 md:max-w-xs">
          <div
            onClick={() => setIsSeatClassOpen(!isSeatClassOpen)}
            className="flex w-full items-center justify-between gap-2 rounded-xl bg-gradient-to-r from-green-50 to-green-50 px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:from-blue-100 hover:to-blue-100"
          >
            <MdAirlineSeatReclineExtra className="text-gray-500" />
            <span>
              {seatClass === "economy"
                ? "Phổ thông"
                : seatClass === "premium_economy"
                  ? "Phổ thông cao cấp"
                  : seatClass === "business"
                    ? "Thương gia"
                    : "Hạng nhất"}
            </span>
            <FaChevronDown
              className={`text-gray-400 transition-transform ${isSeatClassOpen ? "rotate-180" : ""}`}
            />
          </div>

          {isSeatClassOpen && (
            <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-xl border border-gray-100 bg-white p-1 shadow-xl">
              <button
                onClick={() => {
                  setSeatClass("economy");
                  setTravelClass("1");
                  setIsSeatClassOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50"
              >
                Phổ thông
              </button>
              <button
                onClick={() => {
                  setSeatClass("premium_economy");
                  setTravelClass("2");
                  setIsSeatClassOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50"
              >
                Phổ thông cao cấp
              </button>
              <button
                onClick={() => {
                  setSeatClass("business");
                  setTravelClass("3");
                  setIsSeatClassOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50"
              >
                Thương gia
              </button>
              <button
                onClick={() => {
                  setSeatClass("first");
                  setTravelClass("4");
                  setIsSeatClassOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50"
              >
                Hạng nhất
              </button>
            </div>
          )}
        </div>

        {/* Hành khách */}
        <div className="relative">
          <div
            onClick={togglePassengersDropdown}
            className="flex cursor-pointer items-center justify-between gap-2 rounded-xl bg-gradient-to-r from-green-50 to-green-50 px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:from-blue-100 hover:to-blue-100 md:w-auto"
          >
            <FaUser className="text-gray-500" />
            <span>{getTotalPassengers()} Hành khách</span>
            <FaChevronDown
              className={`text-gray-400 transition-transform ${dropdownPassengersOpen ? "rotate-180" : ""}`}
            />
          </div>

          {dropdownPassengersOpen && (
            <div className="absolute z-10 mt-2 rounded-lg bg-white p-4 shadow-md">
              <div className="flex items-center justify-between">
                <span>Người lớn</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePassengerChange("adults", "decrease")}
                    className="rounded-lg bg-gray-200 px-2 py-1"
                  >
                    -
                  </button>
                  <span>{passengers.adults}</span>
                  <button
                    onClick={() => handlePassengerChange("adults", "increase")}
                    className="rounded-lg bg-gray-200 px-2 py-1"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Trẻ em</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handlePassengerChange("children", "decrease")
                    }
                    className="rounded-lg bg-gray-200 px-2 py-1"
                  >
                    -
                  </button>
                  <span>{passengers.children}</span>
                  <button
                    onClick={() =>
                      handlePassengerChange("children", "increase")
                    }
                    className="rounded-lg bg-gray-200 px-2 py-1"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Trẻ sơ sinh (có ghế)</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handlePassengerChange("infants_in_seat", "decrease")
                    }
                    className="rounded-lg bg-gray-200 px-2 py-1"
                  >
                    -
                  </button>
                  <span>{passengers.infants_in_seat}</span>
                  <button
                    onClick={() =>
                      handlePassengerChange("infants_in_seat", "increase")
                    }
                    className="rounded-lg bg-gray-200 px-2 py-1"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Trẻ sơ sinh (ngồi cùng)</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handlePassengerChange("infants_on_lap", "decrease")
                    }
                    className="rounded-lg bg-gray-200 px-2 py-1"
                  >
                    -
                  </button>
                  <span>{passengers.infants_on_lap}</span>
                  <button
                    onClick={() =>
                      handlePassengerChange("infants_on_lap", "increase")
                    }
                    className="rounded-lg bg-gray-200 px-2 py-1"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nút Tìm kiếm */}
      <button
        onClick={handleSearch}
        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-blue-600 hover:to-indigo-600 hover:shadow-xl active:shadow-md"
        disabled={isLoading}
      >
        {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
        {isLoading ? "Đang tìm kiếm..." : ""}
      </button>

      {errorMessage && <div className="mt-2 text-red-500">{errorMessage}</div>}
    </div>
  );
}
