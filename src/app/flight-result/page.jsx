"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

import FlightList from "./components/FlightResult";
import ChangeSearchBar from "./components/FlightChangeSearchBar";
import FlightCard from "./components/FlightCard";
import ProgressBar from "./components/ProgressBar"; // Import thanh tiến trình mới

const FlightSearchResult = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [tripOption, setTripOption] = useState("One way");
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [step, setStep] = useState("outbound");
  const [outboundFlights, setOutboundFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [selectedOutboundFlight, setSelectedOutboundFlight] = useState(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // Thêm state cho progress

  const travelClass = searchParams.get("travel_class") || "1";

  const fetchFlights = async (params, isReturn = false) => {
    setLoading(true);
    setProgress(0);
    try {
      const response = await axios.get("/api/flights", { params });
      const { best_flights = [], other_flights = [] } = response.data;
      const combinedFlights = [...best_flights, ...other_flights];
      const totalSeats = 60;
      const flightsWithSeats = combinedFlights.map((flight) => {
        const availableSeats = Math.floor(Math.random() * 20) + 1;

        return {
          ...flight,
          availableSeats: Math.min(availableSeats, totalSeats), // Đảm bảo số ghế trống không vượt quá 60
        };
      });

      if (!isReturn) {
        setOutboundFlights(flightsWithSeats); // Dữ liệu chiều đi với số ghế ngẫu nhiên
      } else {
        setReturnFlights(flightsWithSeats); // Dữ liệu chiều về với số ghế ngẫu nhiên
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === "outbound") {
      setSelectedReturnFlight(null);
      setReturnFlights([]);
    }
  }, [step]);

  // Hàm cập nhật progress bar trong khi loading
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 300);

      return () => clearInterval(interval);
    } else {
      setProgress(100); // Hoàn thành progress khi dừng loading
    }
  }, [loading]);

  useEffect(() => {
    const engine = searchParams.get("engine");
    const departure_id = searchParams.get("departure_id");
    const arrival_id = searchParams.get("arrival_id");
    const outbound_date = searchParams.get("outbound_date");
    const return_date = searchParams.get("return_date");
    const currency = searchParams.get("currency");
    const hl = searchParams.get("hl");
    const gl = searchParams.get("gl") || "vn";
    const api_key = searchParams.get("api_key");
    const type = searchParams.get("type") || "1";

    if (engine && departure_id && arrival_id && outbound_date && api_key) {
      fetchFlights({
        engine,
        departure_id,
        arrival_id,
        outbound_date,
        return_date,
        currency,
        hl,
        gl,
        api_key,
        type,
      });
    }
  }, [searchParams]);

  const handleSelectOutboundFlight = (flight) => {
    const departureToken = flight.departure_token;

    setSelectedOutboundFlight(flight);
    const engine = searchParams.get("engine");
    const departure_id = searchParams.get("departure_id");
    const arrival_id = searchParams.get("arrival_id");
    const outbound_date = searchParams.get("outbound_date");
    const return_date = searchParams.get("return_date");
    const currency = searchParams.get("currency");
    const hl = searchParams.get("hl");
    const gl = searchParams.get("gl") || "vn";
    const api_key = searchParams.get("api_key");
    const type = searchParams.get("type") || "1";

    if (type === "2") {
      localStorage.setItem("selectedOutboundFlight", JSON.stringify(flight));
      localStorage.setItem("totalPrice", JSON.stringify(flight.price));
      router.push("/booking-details");
    } else if (type === "1") {
      setStep("return");
      fetchFlights(
        {
          engine,
          departure_id,
          arrival_id,
          outbound_date,
          return_date,
          currency,
          hl,
          gl,
          api_key,
          type: "1",
          departure_token: departureToken,
        },
        true,
      );
    }
  };

  const handleReSelectOutboundFlight = () => {
    // Hàm để chọn lại chuyến bay đi
    setStep("outbound");
    setSelectedOutboundFlight(null);
  };

  const handleSelectReturnFlight = (flight) => {
    setSelectedReturnFlight(flight);

    localStorage.setItem(
      "selectedOutboundFlight",
      JSON.stringify(selectedOutboundFlight),
    );
    localStorage.setItem("selectedReturnFlight", JSON.stringify(flight));

    // Tính toán tổng giá vé
    const outboundPrice = selectedOutboundFlight
      ? selectedOutboundFlight.price
      : 0;
    const returnPrice = flight.price;
    const totalPrice = outboundPrice + returnPrice;

    localStorage.setItem("totalPrice", JSON.stringify(totalPrice));

    // Chuyển hướng đến trang booking details
    router.push("/booking-details");
  };

  // JSX cho giao diện hiển thị và thanh progress
  return (
    <div className="mx-auto max-w-7xl px-4" style={{ paddingTop: "80px" }}>
      {loading && <ProgressBar progress={progress} />}{" "}
      {/* Hiển thị thanh tiến trình */}
      <ChangeSearchBar
        from={from}
        to={to}
        departureDate={departureDate}
        returnDate={returnDate}
        passengers={passengers}
        tripOption={tripOption}
        classType="Economy"
        onSearch={() => {}}
      />
      {selectedOutboundFlight && step === "return" && (
        <div className="mb-4 rounded-lg border bg-gray-100 p-4">
          <h3 className="mb-2 text-lg font-bold">Chuyến bay bạn đã lựa chọn</h3>
          <FlightCard
            flight={selectedOutboundFlight}
            onSelect={() => {}}
            leg="outbound"
            isSelectedFlight={true}
            onChangeFlight={handleReSelectOutboundFlight} // Thay đổi ở đây
          />
        </div>
      )}
      {step === "outbound" ? (
        <FlightList
          flights={outboundFlights}
          onSelectFlight={handleSelectOutboundFlight}
          leg="outbound"
          totalFlightsFound={outboundFlights.length}
          travelClass={travelClass} // Truyền hạng ghế vào FlightList
        />
      ) : (
        <FlightList
          flights={returnFlights}
          onSelectFlight={handleSelectReturnFlight}
          leg="return"
          totalFlightsFound={returnFlights.length}
          travelClass={travelClass} // Truyền hạng ghế vào FlightList
        />
      )}
    </div>
  );
};

export default FlightSearchResult;
