import React from "react";

export default function DiscountSection() {
  return (
    <>
      <div
        className="mt-14 w-full rounded-lg p-10"
        style={{
          backgroundImage: `url('/images/bg30.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="rounded-lg bg-opacity-75 p-10">
          <h2
            className="mb-4 text-center text-3xl font-bold"
            style={{ color: "#fff" }}
          >
            Cơ hội giảm giá lên đến 30%
          </h2>
          <p className="mb-6 text-center text-gray-700">
            Hãy đăng ký ngay để nhận ưu đãi bất ngờ từ Vemaybay.vn nhé!
          </p>
          <div className="flex items-center justify-center">
            <input
              type="email"
              placeholder="Nhập email"
              className="max-w-[500px] grow rounded-l-lg border border-gray-300 p-4 focus:outline-none"
            />
            <button className="rounded-r-lg bg-orange-500 px-6 py-4 text-white">
              Gửi ngay
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
