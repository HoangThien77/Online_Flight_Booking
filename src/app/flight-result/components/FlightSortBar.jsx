"use client";

import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";

const FlightSortBar = ({ flights, onSort, className }) => {
  const [selectedSort, setSelectedSort] = useState(null);
  const [cheapestFlight, setCheapestFlight] = useState(null);
  const [fastestFlight, setFastestFlight] = useState(null);
  const [bestFlight, setBestFlight] = useState(null);

  // Calculate total duration for a flight
  const getTotalDuration = (flight) => {
    return flight.flights.reduce(
      (total, segment) => total + segment.duration,
      0,
    );
  };

  // Find the cheapest, fastest, and best flight independently
  useEffect(() => {
    if (flights.length === 0) return;

    const sortedByPrice = [...flights].sort((a, b) => a.price - b.price);
    const sortedByDuration = [...flights].sort(
      (a, b) => getTotalDuration(a) - getTotalDuration(b),
    );
    const sortedByBest = [...flights].sort((a, b) => {
      if (a.price !== b.price) return a.price - b.price;

      return getTotalDuration(a) - getTotalDuration(b);
    });

    setCheapestFlight(sortedByPrice[0]);
    setFastestFlight(sortedByDuration[0]);
    setBestFlight(sortedByBest[0]);
  }, [flights]);

  // Handle sorting when a button is clicked
  const handleSort = (type) => {
    setSelectedSort(type);
    let sortedFlights = [...flights];

    switch (type) {
      case "cheapest":
        sortedFlights.sort((a, b) => a.price - b.price);
        break;
      case "fastest":
        sortedFlights.sort((a, b) => getTotalDuration(a) - getTotalDuration(b));
        break;
      case "best":
        sortedFlights.sort((a, b) => {
          if (a.price !== b.price) return a.price - b.price;

          return getTotalDuration(a) - getTotalDuration(b);
        });
        break;
    }

    onSort(sortedFlights);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border bg-white p-1",
        className,
      )}
    >
      <button
        onClick={() => handleSort("cheapest")}
        className={cn(
          "flex flex-1 items-center justify-between rounded-md px-4 py-2 text-sm transition-colors",
          selectedSort === "cheapest"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted",
        )}
      >
        <div className="flex flex-col items-start">
          <span className="font-medium">Rẻ nhất</span>
          {cheapestFlight && (
            <span className="text-xs">
              {cheapestFlight.price.toLocaleString("vi-VN")}đ •{" "}
              {Math.floor(getTotalDuration(cheapestFlight) / 60)}h{" "}
              {getTotalDuration(cheapestFlight) % 60}m
            </span>
          )}
        </div>
      </button>

      <button
        onClick={() => handleSort("best")}
        className={cn(
          "flex flex-1 items-center justify-between rounded-md px-4 py-2 text-sm transition-colors",
          selectedSort === "best"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted",
        )}
      >
        <div className="flex flex-col items-start">
          <span className="font-medium">Tổng thể tốt nhất</span>
          {bestFlight && (
            <span className="text-xs">
              {bestFlight.price.toLocaleString("vi-VN")}đ •{" "}
              {Math.floor(getTotalDuration(bestFlight) / 60)}h{" "}
              {getTotalDuration(bestFlight) % 60}m
            </span>
          )}
        </div>
      </button>

      <button
        onClick={() => handleSort("fastest")}
        className={cn(
          "flex flex-1 items-center justify-between rounded-md px-4 py-2 text-sm transition-colors",
          selectedSort === "fastest"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted",
        )}
      >
        <div className="flex flex-col items-start">
          <span className="font-medium">Nhanh nhất</span>
          {fastestFlight && (
            <span className="text-xs">
              {fastestFlight.price?.toLocaleString("vi-VN")}đ •{" "}
              {Math.floor(getTotalDuration(fastestFlight) / 60)}h{" "}
              {getTotalDuration(fastestFlight) % 60}m
            </span>
          )}
        </div>
      </button>

      {/* <button className="rounded-md p-2 hover:bg-muted">
        <ChevronDown className="size-4" />
        <span className="sr-only">More sorting options</span>
      </button> */}
    </div>
  );
};

export default FlightSortBar;
