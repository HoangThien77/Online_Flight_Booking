import { useState, useEffect } from "react";
import { Tooltip } from "@nextui-org/tooltip";
import { formatDuration } from "date-fns";
export default function FlightDetails({ flightDetails, flightType }) {
  const [isOutboundDetailVisible, setIsOutboundDetailVisible] = useState(false);
  const [isReturnDetailVisible, setIsReturnDetailVisible] = useState(false);

  // State to store selected seats from localStorage
  const [outboundSeat, setOutboundSeat] = useState(null);
  const [returnSeat, setReturnSeat] = useState(null);

  // Effect to load selected seats from localStorage when the component mounts
  useEffect(() => {
    const savedOutboundSeat = localStorage.getItem("selectedOutboundSeat");
    const savedReturnSeat = localStorage.getItem("selectedReturnSeat");

    setOutboundSeat(savedOutboundSeat);
    setReturnSeat(savedReturnSeat);
  }, []);

  // Toggle function to show or hide outbound flight details
  const handleToggleOutboundDetail = () => {
    setIsOutboundDetailVisible(!isOutboundDetailVisible);
  };

  // Toggle function to show or hide return flight details
  const handleToggleReturnDetail = () => {
    setIsReturnDetailVisible(!isReturnDetailVisible);
  };

  return (
    <div className="mb-4 rounded-lg bg-white p-6 shadow-md">
      {/* Nội dung chính của trang */}
      <div className="mb-4 flex items-center rounded-md bg-orange-100 p-3">
        <img
          alt=""
          className="mr-3 size-12"
          src="./images/icons8-protect-96.png"
        />
        <span className="font-semibold text-orange-700">
          SummerTravel sẽ bảo vệ chuyến đi của bạn và giữ an toàn cho thông tin
          của bạn
        </span>
      </div>

      {/* Hiển thị thông tin chiều đi */}
      {flightDetails.outbound && (
        <div className="relative mb-4 rounded-lg bg-white p-6 shadow-md">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-3 rounded bg-blue-600 px-3 py-1 font-semibold text-white">
                Chiều đi
              </span>
              <h2 className="text-xl font-bold text-gray-800">
                {flightDetails.outbound.flights[0].departure_airport.id} →{" "}
                {
                  flightDetails.outbound.flights[
                    flightDetails.outbound.flights.length - 1
                  ].arrival_airport.id
                }
              </h2>
            </div>
            <button
              className="font-semibold text-gray-400 hover:text-gray-500"
              onClick={handleToggleOutboundDetail}
            >
              Chi tiết
            </button>
          </div>

          <p className="mb-4 text-sm text-gray-500">
            {flightDetails.outbound.flights[0].departure_airport.name} →{" "}
            {
              flightDetails.outbound.flights[
                flightDetails.outbound.flights.length - 1
              ].arrival_airport.name
            }
          </p>

          {/* Display selected outbound seat */}
          {outboundSeat && (
            <p className="mb-4 text-sm font-bold text-blue-600">
              Ghế đã chọn (Chiều đi): {outboundSeat}
            </p>
          )}

          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <img
                alt="logo"
                className="size-10 object-contain"
                src={flightDetails.outbound.flights[0].airline_logo}
              />
              <div className="flex flex-col text-start text-xs lg:text-sm">
                <div>{flightDetails.outbound.flights[0].airline}</div>
                <div className="text-black">
                  {flightDetails.outbound.flights[0].flight_number}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <p className="text-xl font-bold">
                {flightDetails.outbound.flights[0].departure_airport.time.substring(
                  11,
                  16,
                )}
              </p>
              <p className="text-sm text-gray-500">
                {flightDetails.outbound.flights[0].departure_airport.id}
              </p>
            </div>

            <Tooltip
              content={
                <span>
                  {
                    flightDetails.outbound.flights[
                      flightDetails.outbound.flights.length - 1
                    ].arrival_airport.name
                  }
                </span>
              }
              placement="bottom"
              radius="none"
              showArrow={true}
            >
              <div className="flex w-1/2 flex-col justify-between space-y-1 overflow-hidden">
                <div className="overflow-hidden text-center text-xs text-black">
                  <span className="inline-block truncate whitespace-nowrap">
                    {formatDuration(flightDetails.outbound.total_duration)}
                  </span>
                </div>
                <div className="relative flex justify-between">
                  <div className="size-1.5 rounded-full bg-black" />
                  <div className="size-1.5 rounded-full bg-black" />
                  <div className="size-1.5 rounded-full bg-black" />
                  <div className="absolute top-1/2 z-0 h-0.5 w-full -translate-y-1/2 bg-black" />
                </div>
                <div className="text-center text-sm text-slate-400">
                  <span>
                    {flightDetails.outbound.flights.length > 1
                      ? "Layover"
                      : "Bay thẳng"}
                  </span>
                </div>
              </div>
            </Tooltip>

            <div className="flex flex-col items-center text-center">
              <p className="text-xl font-bold">
                {flightDetails.outbound.flights[
                  flightDetails.outbound.flights.length - 1
                ].arrival_airport.time.substring(11, 16)}
              </p>
              <p className="text-sm text-gray-500">
                {
                  flightDetails.outbound.flights[
                    flightDetails.outbound.flights.length - 1
                  ].arrival_airport.id
                }
              </p>
            </div>
          </div>

          {isOutboundDetailVisible && (
            <div className="mt-4">
              {flightDetails.outbound.flights.map((flight, index) => (
                <div
                  key={index}
                  className="mt-4 flex items-center justify-between rounded-lg bg-gray-100 p-4 shadow-sm"
                >
                  <div className="flex w-1/3 flex-col items-center space-y-2">
                    <div className="text-lg font-bold text-gray-800">
                      {flight.departure_airport.time}
                    </div>
                    <div className="text-xs text-gray-500">
                      {flight.departure_airport.date}
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="m-1 size-2 rounded-full border-2 border-blue-500" />
                      <div className="h-14 w-0.5 bg-black" />
                      <div className="m-1 size-2 rounded-full bg-blue-500" />
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {flight.arrival_airport.time}
                    </div>
                    <div className="text-xs text-gray-500">
                      {flight.arrival_airport.date}
                    </div>
                  </div>

                  <div className="flex w-2/4 flex-col justify-between space-y-2">
                    <div>
                      <p className="font-semibold text-gray-800">
                        Bay từ: ({flight.departure_airport.id}){" "}
                        {flight.departure_airport.country_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {" "}
                        {flight.departure_airport.name}{" "}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Bay đến: ({flight.arrival_airport.id})
                      </p>
                      <p className="text-sm text-gray-500">
                        {" "}
                        {flight.arrival_airport.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex w-1/4 flex-col items-end space-y-2 text-right">
                    <img
                      alt="logo"
                      className="size-8 object-contain"
                      src={flight.airline_logo}
                    />
                    <p className="text-sm font-semibold text-gray-800">
                      Hãng bay: {flight.airline}
                    </p>
                    <p className="text-sm text-gray-500">
                      Số hiệu: {flight.flight_number}
                    </p>
                    <p className="text-sm text-gray-500">
                      Máy bay: {flight.airplane}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hiển thị chiều về nếu là vé khứ hồi */}
      {flightType === "1" && flightDetails.return && (
        <div className="relative mb-4 rounded-lg bg-white p-6 shadow-md">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-3 rounded bg-blue-600 px-3 py-1 font-semibold text-white">
                Chiều về
              </span>
              <h2 className="text-xl font-bold text-gray-800">
                {flightDetails.return.flights[0].departure_airport.id} →{" "}
                {
                  flightDetails.return.flights[
                    flightDetails.return.flights.length - 1
                  ].arrival_airport.id
                }
              </h2>
            </div>
            <button
              className="font-semibold text-gray-400 hover:text-gray-500"
              onClick={handleToggleReturnDetail}
            >
              Chi tiết
            </button>
          </div>

          <p className="mb-4 text-sm text-gray-500">
            {flightDetails.return.flights[0].departure_airport.name} →{" "}
            {
              flightDetails.return.flights[
                flightDetails.return.flights.length - 1
              ].arrival_airport.name
            }
          </p>

          {/* Display selected return seat */}
          {returnSeat && (
            <p className="mb-4 text-sm font-bold text-blue-600">
              Ghế đã chọn (Chiều về): {returnSeat}
            </p>
          )}

          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <img
                alt="logo"
                className="size-10 object-contain"
                src={flightDetails.return.flights[0].airline_logo}
              />
              <div className="flex flex-col text-start text-xs lg:text-sm">
                <div>{flightDetails.return.flights[0].airline}</div>
                <div className="text-black">
                  {flightDetails.return.flights[0].flight_number}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <p className="text-xl font-bold">
                {flightDetails.return.flights[0].departure_airport.time.substring(
                  11,
                  16,
                )}
              </p>
              <p className="text-sm text-gray-500">
                {flightDetails.return.flights[0].departure_airport.id}
              </p>
            </div>

            <Tooltip
              content={
                <span>
                  {
                    flightDetails.return.flights[
                      flightDetails.return.flights.length - 1
                    ].arrival_airport.name
                  }
                </span>
              }
              placement="bottom"
              radius="none"
              showArrow={true}
            >
              <div className="flex w-1/2 flex-col justify-between space-y-1 overflow-hidden">
                <div className="overflow-hidden text-center text-xs text-black">
                  <span className="inline-block truncate whitespace-nowrap">
                    {formatDuration(flightDetails.return.total_duration)}
                  </span>
                </div>
                <div className="relative flex justify-between">
                  <div className="size-1.5 rounded-full bg-black" />
                  <div className="size-1.5 rounded-full bg-black" />
                  <div className="size-1.5 rounded-full bg-black" />
                  <div className="absolute top-1/2 z-0 h-0.5 w-full -translate-y-1/2 bg-black" />
                </div>
                <div className="text-center text-sm text-slate-400">
                  <span>
                    {flightDetails.return.flights.length > 1
                      ? "Layover"
                      : "Bay thẳng"}
                  </span>
                </div>
              </div>
            </Tooltip>

            <div className="flex flex-col items-center text-center">
              <p className="text-xl font-bold">
                {flightDetails.return.flights[
                  flightDetails.return.flights.length - 1
                ].arrival_airport.time.substring(11, 16)}
              </p>
              <p className="text-sm text-gray-500">
                {
                  flightDetails.return.flights[
                    flightDetails.return.flights.length - 1
                  ].arrival_airport.id
                }
              </p>
            </div>
          </div>

          {isReturnDetailVisible && (
            <div className="mt-4">
              {flightDetails.return.flights.map((flight, index) => (
                <div
                  key={index}
                  className="mt-4 flex items-center justify-between rounded-lg bg-gray-100 p-4 shadow-sm"
                >
                  <div className="flex w-1/3 flex-col items-center space-y-2">
                    <div className="text-lg font-bold text-gray-800">
                      {flight.departure_airport.time}
                    </div>
                    <div className="text-xs text-gray-500">
                      {flight.departure_airport.date}
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="m-1 size-2 rounded-full border-2 border-blue-500" />
                      <div className="h-14 w-0.5 bg-black" />
                      <div className="m-1 size-2 rounded-full bg-blue-500" />
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {flight.arrival_airport.time}
                    </div>
                    <div className="text-xs text-gray-500">
                      {flight.arrival_airport.date}
                    </div>
                  </div>

                  <div className="flex w-2/4 flex-col justify-between space-y-2">
                    <div>
                      <p className="font-semibold text-gray-800">
                        Bay từ: ({flight.departure_airport.id}){" "}
                        {flight.departure_airport.country_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {" "}
                        {flight.departure_airport.name}{" "}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Bay đến: ({flight.arrival_airport.id})
                      </p>
                      <p className="text-sm text-gray-500">
                        {" "}
                        {flight.arrival_airport.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex w-1/4 flex-col items-end space-y-2 text-right">
                    <img
                      alt="logo"
                      className="size-8 object-contain"
                      src={flight.airline_logo}
                    />
                    <p className="text-sm font-semibold text-gray-800">
                      Hãng bay: {flight.airline}
                    </p>
                    <p className="text-sm text-gray-500">
                      Số hiệu: {flight.flight_number}
                    </p>
                    <p className="text-sm text-gray-500">
                      Máy bay: {flight.airplane}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
