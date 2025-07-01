"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

import FlightList from "./components/FlightResult";
import ChangeSearchBar from "./components/FlightChangeSearchBar";
import FlightCard from "./components/FlightCard";
import ReviewFlightSection from "./components/ReviewFlightSection";

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
  const [showReview, setShowReview] = useState(false);

  const travelClass = searchParams.get("travel_class") || "1";
  const minLoadingDuration = 4000; // Minimum loading duration (4 seconds)

  const fetchFlights = async (params, isReturn = false) => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const response = await axios.get("/api/flights", { params });
      const { best_flights = [], other_flights = [] } = response.data;
      const combinedFlights = [...best_flights, ...other_flights];
      const totalSeats = 60;
      const flightsWithSeats = combinedFlights.map((flight) => {
        const availableSeats = Math.floor(Math.random() * 20) + 1;

        return {
          ...flight,
          availableSeats: Math.min(availableSeats, totalSeats),
        };
      });

      // Calculate elapsed time and delay if needed
      const elapsedTime = Date.now() - startTime;
      const remainingTime = minLoadingDuration - elapsedTime;

      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      if (!isReturn) {
        setOutboundFlights(flightsWithSeats);
      } else {
        setReturnFlights(flightsWithSeats);
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

  useEffect(() => {
    const searchId = searchParams.get("searchId");

    if (searchId) {
      const cachedData = localStorage.getItem(`flightData_${searchId}`);

      if (cachedData) {
        setLoading(true); // Ensure loading starts for cached data
        setTimeout(() => {
          try {
            const parsedData = JSON.parse(cachedData);
            const { best_flights = [], other_flights = [] } = parsedData;
            const combinedFlights = [...best_flights, ...other_flights];

            setOutboundFlights(combinedFlights);
            setLoading(false);
          } catch (error) {
            console.error("Lỗi khi đọc dữ liệu cache:", error);
            setLoading(false);
          }
        }, minLoadingDuration); // Delay to ensure minimum loading time
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const searchId = searchParams.get("searchId");
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
    const adults = searchParams.get("adults") || "1";
    const children = searchParams.get("children") || "0";
    const infants_in_seat = searchParams.get("infants_in_seat") || "0";
    const infants_on_lap = searchParams.get("infants_on_lap") || "0";

    if (searchId) {
      const cachedData = localStorage.getItem(`flightData_${searchId}`);

      if (cachedData) {
        setLoading(true);
        setTimeout(() => {
          try {
            const parsedData = JSON.parse(cachedData);
            const { best_flights = [], other_flights = [] } = parsedData;
            const combinedFlights = [...best_flights, ...other_flights];

            setOutboundFlights(combinedFlights);
            setLoading(false);
          } catch (error) {
            console.error("Lỗi khi đọc dữ liệu cache:", error);
            setLoading(false);
          }
        }, minLoadingDuration);
      }
    } else if (
      engine &&
      departure_id &&
      arrival_id &&
      outbound_date &&
      api_key
    ) {
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
        adults,
        children,
        infants_in_seat,
        infants_on_lap,
      });
    }
  }, [searchParams]);

  const handleSelectOutboundFlight = (flight) => {
    const departureToken = flight.departure_token;

    setSelectedOutboundFlight(flight);

    const type = searchParams.get("type") || "1";

    if (type === "2") {
      setShowReview(true);
      localStorage.setItem("selectedOutboundFlight", JSON.stringify(flight));
      localStorage.setItem("totalPrice", JSON.stringify(flight.price));
    } else if (type === "1") {
      setStep("return");
      fetchFlights(
        {
          engine: searchParams.get("engine"),
          departure_id: searchParams.get("departure_id"),
          arrival_id: searchParams.get("arrival_id"),
          outbound_date: searchParams.get("outbound_date"),
          return_date: searchParams.get("return_date"),
          currency: searchParams.get("currency"),
          hl: searchParams.get("hl"),
          gl: searchParams.get("gl") || "vn",
          api_key: searchParams.get("api_key"),
          type: "1",
          departure_token: departureToken,
        },
        true,
      );
    }
  };

  const handleSelectReturnFlight = (flight) => {
    setSelectedReturnFlight(flight);
    setShowReview(true);
    localStorage.setItem(
      "selectedOutboundFlight",
      JSON.stringify(selectedOutboundFlight),
    );
    localStorage.setItem("selectedReturnFlight", JSON.stringify(flight));

    const outboundPrice = selectedOutboundFlight
      ? selectedOutboundFlight.price
      : 0;
    const returnPrice = flight.price;
    const totalPrice = outboundPrice + returnPrice;

    localStorage.setItem("totalPrice", JSON.stringify(totalPrice));
  };

  const handleContinue = () => {
    if (selectedOutboundFlight) {
      localStorage.setItem(
        "selectedOutboundFlight",
        JSON.stringify(selectedOutboundFlight),
      );
    }
    if (selectedReturnFlight) {
      localStorage.setItem(
        "selectedReturnFlight",
        JSON.stringify(selectedReturnFlight),
      );
      const totalPrice =
        selectedOutboundFlight.price + selectedReturnFlight.price;

      localStorage.setItem("totalPrice", JSON.stringify(totalPrice));
    } else if (selectedOutboundFlight) {
      localStorage.setItem(
        "totalPrice",
        JSON.stringify(selectedOutboundFlight.price),
      );
      localStorage.removeItem("selectedReturnFlight");
    }
    router.push("/booking-details");
  };

  const outboundFlight = JSON.parse(
    localStorage.getItem("selectedOutboundFlight"),
  );
  const returnFlight = JSON.parse(localStorage.getItem("selectedReturnFlight"));

  return (
    <div className="mx-auto max-w-7xl px-4" style={{ paddingTop: "80px" }}>
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
      {showReview && (
        <ReviewFlightSection
          outbound={selectedOutboundFlight}
          inbound={step === "return" ? selectedReturnFlight : null}
          totalPrice={
            selectedOutboundFlight.price + (selectedReturnFlight?.price || 0)
          }
          onContinue={handleContinue}
          onClose={() => setShowReview(false)}
        />
      )}
      {selectedOutboundFlight && step === "return" && !selectedReturnFlight && (
        <div className="mb-4 rounded-lg border bg-gray-100 p-4">
          <h3 className="mb-2 text-lg font-bold">Chuyến bay bạn đã lựa chọn</h3>
          <FlightCard
            flight={selectedOutboundFlight}
            onSelect={() => {}}
            leg="outbound"
            isSelectedFlight={true}
            onChangeFlight={() => {
              setStep("outbound");
              setSelectedOutboundFlight(null);
              setShowReview(false);
            }}
            loading={loading}
          />
        </div>
      )}
      {step === "outbound" ? (
        <FlightList
          flights={outboundFlights}
          onSelectFlight={handleSelectOutboundFlight}
          leg="outbound"
          totalFlightsFound={outboundFlights.length}
          travelClass={travelClass}
          loading={loading}
        />
      ) : (
        <FlightList
          flights={returnFlights}
          onSelectFlight={handleSelectReturnFlight}
          leg="return"
          totalFlightsFound={returnFlights.length}
          travelClass={travelClass}
          loading={loading}
        />
      )}
    </div>
  );
};

export default FlightSearchResult;
