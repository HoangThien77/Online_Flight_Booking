import { useState, useEffect } from "react";

export default function Component({
  totalSeats = 40,
  availableSeats = 60,
  onClose,
  onSelectSeat,
  leg,
}) {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredSeat, setHoveredSeat] = useState(null);

  // Tạo mảng ghế với 10 hàng và 6 cột (A-F)
  const seatRows = Array.from({ length: 10 }, (_, i) =>
    ["A", "B", "C", "D", "E", "F"].map((letter) => `${i + 1}${letter}`),
  );

  useEffect(() => {
    const allSeats = seatRows.flat();
    const bookedSeatsCount = availableSeats - totalSeats;
    const tempBookedSeats = new Set();

    while (tempBookedSeats.size < bookedSeatsCount) {
      tempBookedSeats.add(
        allSeats[Math.floor(Math.random() * allSeats.length)],
      );
    }

    setBookedSeats([...tempBookedSeats]);
  }, [totalSeats, availableSeats]);

  const handleSeatClick = (seat) => {
    if (!bookedSeats.includes(seat)) {
      setSelectedSeat(seat === selectedSeat ? null : seat);
    }
  };

  const handleAccept = () => {
    setIsLoading(true);
    setTimeout(() => {
      onSelectSeat(selectedSeat);
      localStorage.setItem(`selected${leg}Seat`, selectedSeat);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  const getSeatStyle = (seat) => {
    if (bookedSeats.includes(seat)) {
      return "bg-gray-300 text-gray-500 cursor-not-allowed";
    }
    if (selectedSeat === seat) {
      return "bg-green-500 text-white ring-2 ring-green-600 ring-offset-2";
    }
    if (hoveredSeat === seat) {
      return "bg-blue-400 text-white";
    }

    return "bg-blue-500 text-white hover:bg-blue-600";
  };

  return (
    <div>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose}></div>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ paddingTop: "10vh" }}
      >
        <div className="w-[500px] rounded-lg bg-white p-8 shadow-lg">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-10 w-3/4 items-center justify-center rounded-t-2xl bg-gray-200 text-gray-700 shadow-inner">
              Màn hình
            </div>
            <h2 className="mb-6 text-xl font-medium">
              Vui lòng chọn ghế ngồi !
            </h2>
          </div>

          {/* Legend */}
          <div className="mb-4 flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="size-5 rounded bg-gray-200"></div>
              <span className="text-sm">Đã đặt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-5 rounded bg-blue-500"></div>
              <span className="text-sm">Có sẵn</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="size-6 rounded bg-green-500 ring-2 ring-green-600 ring-offset-2"></div>
              <span className="text-sm text-gray-600">Đã chọn</span>
            </div>
          </div>

          {/* Exit Sign Top */}
          <div className="mb-4 flex justify-between">
            <span className="rounded bg-red-500 px-4 py-1 text-sm text-white">
              EXIT
            </span>
            <span className="rounded bg-red-500 px-4 py-1 text-sm text-white">
              EXIT
            </span>
          </div>

          {/* Seat Grid */}
          <div className="mb-4 ml-5 grid gap-2">
            {seatRows.map((row, i) => (
              <div key={i} className="flex justify-center">
                <div className="grid w-full grid-cols-6 gap-2">
                  {row.map((seat) => (
                    <button
                      key={seat}
                      onClick={() => handleSeatClick(seat)}
                      onMouseEnter={() =>
                        !bookedSeats.includes(seat) && setHoveredSeat(seat)
                      }
                      onMouseLeave={() => setHoveredSeat(null)}
                      disabled={bookedSeats.includes(seat)}
                      className={`flex size-10 items-center justify-center rounded text-sm font-medium ${getSeatStyle(
                        seat,
                      )}`}
                    >
                      {bookedSeats.includes(seat) ? "×" : seat}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Exit Sign Bottom */}
          <div className="mb-4 flex justify-between">
            <span className="rounded bg-red-500 px-4 py-1 text-sm text-white">
              EXIT
            </span>
            <span className="rounded bg-red-500 px-4 py-1 text-sm text-white">
              EXIT
            </span>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              onClick={handleAccept}
              disabled={!selectedSeat || isLoading}
              className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="size-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </div>
              ) : (
                "Xác nhận"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
