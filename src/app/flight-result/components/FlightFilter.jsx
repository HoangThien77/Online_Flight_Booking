"use client";
import React, { useState, useMemo, useEffect } from "react";
import Slider from "rc-slider";

import "rc-slider/assets/index.css";
import {
  getMinMaxPrice,
  getUniqueAirlineNames,
  getMinMaxDuration,
} from "../../../utils";

const FlightFilter = ({ flights, onFilterResult }) => {
  const { minPrice, maxPrice } = useMemo(() => {
    if (!flights || flights.length === 0) {
      return { minPrice: 0, maxPrice: 0 };
    }

    return getMinMaxPrice(flights);
  }, [flights]);

  const { minDuration, maxDuration } = useMemo(() => {
    if (!flights || flights.length === 0) {
      return { minDuration: 0, maxDuration: 0 };
    }

    return getMinMaxDuration(flights);
  }, [flights]);

  useEffect(() => {
    setFlightDuration([minDuration, maxDuration]);
    setPriceRange([minPrice, maxPrice]);
    setUniqueAirlineNames(getUniqueAirlineNames(flights));
  }, [minDuration, maxDuration, minPrice, maxPrice, flights]);

  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [flightDuration, setFlightDuration] = useState([
    minDuration,
    maxDuration,
  ]);
  const [uniqueAirlineNames, setUniqueAirlineNames] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState({});
  const [stopPoints, setStopPoints] = useState({
    direct: false,
    oneStop: false,
    multipleStops: false,
  });

  const filterFlights = () => {
    let filteredFlights = flights;

    // Nếu chọn "Bay thẳng", lọc các chuyến bay không có điểm dừng (length = 0)
    if (stopPoints.direct) {
      filteredFlights = filteredFlights.filter(
        (flight) => flight.flights.length === 1,
      );
    }

    // Nếu chọn "1 điểm dừng", lọc các chuyến bay có đúng 1 điểm dừng (length = 1)
    if (stopPoints.oneStop) {
      filteredFlights = filteredFlights.filter(
        (flight) => flight.flights.length === 2,
      );
    }

    // Nếu chọn "Nhiều điểm dừng", lọc các chuyến bay có nhiều hơn 1 điểm dừng (length > 1)
    if (stopPoints.multipleStops) {
      filteredFlights = filteredFlights.filter(
        (flight) => flight.flights.length > 2,
      );
    }

    const selectedAirlinesList = Object.keys(selectedAirlines).filter(
      (airline) => selectedAirlines[airline],
    );

    if (selectedAirlinesList.length > 0) {
      filteredFlights = filteredFlights.filter((flight) =>
        selectedAirlinesList.includes(flight.flights[0]?.airline),
      );
    }

    filteredFlights = filteredFlights.filter(
      (flight) =>
        flight.price >= priceRange[0] && flight.price <= priceRange[1],
    );

    filteredFlights = filteredFlights.filter(
      (flight) =>
        flight.total_duration >= flightDuration[0] &&
        flight.total_duration <= flightDuration[1],
    );

    return filteredFlights;
  };

  const handlePriceChange = (value) => setPriceRange(value);
  const handleFlightDurationChange = (value) => setFlightDuration(value);

  const handleCheckboxChange = (airline) => {
    setSelectedAirlines({
      ...selectedAirlines,
      [airline]: !selectedAirlines[airline],
    });
  };

  const handleClearFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setFlightDuration([minDuration, maxDuration]);
    setSelectedAirlines({});
    setStopPoints({ direct: false, oneStop: false, multipleStops: false });
  };

  useEffect(() => {
    const filteredFlights = filterFlights();

    onFilterResult(filteredFlights);
  }, [stopPoints, flights, selectedAirlines, priceRange, flightDuration]);

  return (
    <div className="sticky top-4 h-screen basis-[282px] overflow-y-auto">
      <form noValidate>
        <div
          id="filter-flight-ctn"
          className="filter-flight-ctn flex flex-col space-y-3 pr-3"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 py-3">
            <span className="text-lg font-semibold">Bộ lọc</span>
            <span
              className="cursor-pointer text-sm text-primary"
              onClick={handleClearFilters}
            >
              Xóa tất cả
            </span>
          </div>

          {/* Bộ lọc điểm dừng */}
          <div>
            <div className="py-3">
              <span className="font-semibold">Điểm dừng</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={stopPoints.direct}
                  onChange={() =>
                    setStopPoints((prev) => ({ ...prev, direct: !prev.direct }))
                  }
                />
                <label>Bay thẳng</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={stopPoints.oneStop}
                  onChange={() =>
                    setStopPoints((prev) => ({
                      ...prev,
                      oneStop: !prev.oneStop,
                    }))
                  }
                />
                <label>1 điểm dừng</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={stopPoints.multipleStops}
                  onChange={() =>
                    setStopPoints((prev) => ({
                      ...prev,
                      multipleStops: !prev.multipleStops,
                    }))
                  }
                />
                <label>Nhiều điểm dừng</label>
              </div>
            </div>
          </div>

          {/* Bộ lọc giá tiền */}
          <div className="border-t-2">
            <div className="py-3">
              <span className="font-semibold">Giá tiền</span>
            </div>
            <div className="p-3">
              <Slider
                range
                min={minPrice}
                max={maxPrice}
                defaultValue={priceRange}
                onChange={handlePriceChange}
              />
              <div className="text-neutral flex justify-between">
                <span>{priceRange[0].toLocaleString("vi-VN")} ₫</span>
                <span>{priceRange[1].toLocaleString("vi-VN")} ₫</span>
              </div>
            </div>
          </div>

          {/* Bộ lọc thời gian bay */}
          <div className="border-t">
            <div className="py-3">
              <span className="font-semibold">Thời gian bay</span>
            </div>
            <div className="p-3">
              <Slider
                range
                min={minDuration}
                max={maxDuration}
                defaultValue={flightDuration}
                onChange={handleFlightDurationChange}
              />
              <div className="text-neutral flex justify-between">
                <span>{flightDuration[0]} phút</span>
                <span>{flightDuration[1]} phút</span>
              </div>
            </div>
          </div>

          {/* Bộ lọc hãng bay */}
          <div className="border-t">
            <div className="py-3">
              <span className="font-semibold">Hãng bay</span>
            </div>
            {uniqueAirlineNames?.map((airline, index) => (
              <div className="flex items-center space-x-2 py-2" key={index}>
                <input
                  type="checkbox"
                  checked={selectedAirlines[airline] || false}
                  onChange={() => handleCheckboxChange(airline)}
                />
                <label>{airline}</label>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FlightFilter;
