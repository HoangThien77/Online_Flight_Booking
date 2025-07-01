import React, { useState, useEffect } from "react";

import FlightCard from "./FlightCard";
import FlightFilter from "./FlightFilter";
import FlightSortBar from "./FlightSortBar";
import ProgressBar from "./ProgressBar";

import { travelClassLabel } from "@/const";

const FlightList = ({
  flights,
  onSelectFlight,
  leg,
  totalFlightsFound,
  travelClass,
  loading, // Thêm prop loading
}) => {
  const [displayFlight, setDisplayFlight] = useState(flights);

  useEffect(() => {
    setDisplayFlight(flights);
  }, [flights]);

  const handleSort = (results) => {
    setDisplayFlight(results);
  };

  const handleFilter = (results) => {
    setDisplayFlight(results);
  };

  return (
    <div className="mx-auto -mt-2 flex max-w-7xl flex-col space-y-4 pb-10 max-sm:px-0 sm:mt-0 sm:space-y-6">
      <div className="relative mt-10 flex gap-x-6">
        <FlightFilter flights={flights} onFilterResult={handleFilter} />
        <div className="flex min-h-[80vh] max-w-full grow flex-col space-y-4 md:max-w-[calc(100%_-_282px-24px)]">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {leg === "outbound"
                  ? "Chọn chuyến bay đi"
                  : "Chọn chuyến bay về"}
              </h2>
              <span className="font-medium text-black">
                Tổng vé bay: {totalFlightsFound} / Hạng ghế:{" "}
                {travelClassLabel[travelClass]}
              </span>
            </div>
          </div>
          <FlightSortBar flights={displayFlight} onSort={handleSort} />
          <ProgressBar loading={loading} />
          <div className="infinite-scroll-component relative divide-y md:space-y-1.5 md:divide-y-0">
            <div className="min-h-[200px] space-y-2">
              {displayFlight.map((flight, index) => (
                <FlightCard
                  key={index}
                  flight={flight}
                  onSelect={() => onSelectFlight(flight)}
                  leg={leg}
                  loading={loading} // Truyền prop loading
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightList;
