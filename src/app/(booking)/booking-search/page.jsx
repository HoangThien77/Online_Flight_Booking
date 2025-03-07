"use client";

import { useState } from "react";
import { FaPlane, FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";

import { encryptPNR } from "@/utils";

const BookingSearchPage = () => {
  const [pnrId, setPnrId] = useState("");
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!pnrId) {
      setError("Vui lòng nhập số mã hồ sơ đặt chỗ");

      return;
    }
    router.push(`/booking-search/result?pnr_id=${encryptPNR(pnrId)}`);
  };

  return (
    <div
      className="relative flex h-[800px] items-center justify-center"
      style={{
        backgroundImage: `url('/images/bg1.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div>
        <div className="mb-2 text-center">
          <h1 className="text-4xl font-bold text-white">Tra cứu vé máy bay</h1>
        </div>
        <div
          className="bg-white p-10 shadow-lg"
          style={{ borderRadius: "20px" }}
        >
          <div className="flex-col">
            {error && <p className="mb-2 text-red-500">{error}</p>}
            <div className="flex justify-between gap-3">
              <div className="relative">
                <FaPlane className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  className="w-full rounded-lg border bg-white p-3 pl-10 text-xl text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Mã hồ sơ đặt chỗ"
                  type="text"
                  value={pnrId}
                  onChange={(e) => setPnrId(e.target.value)}
                />
              </div>
              <button
                className="flex h-[55px] items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-xl text-white"
                onClick={handleSearch}
              >
                <FaSearch className="mr-2" /> Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSearchPage;
