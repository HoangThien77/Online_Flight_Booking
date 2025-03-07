"use client";
import "./Ticket.css"; // Import file CSS

export default function Ticket() {
  return (
    <>
      {/* Container chính */}
      <div className="mx-auto mt-16 flex max-w-7xl space-x-20 rounded-lg bg-gray-50 p-6 shadow-md">
        {" "}
        {/* Sử dụng flex và space-x-8 để tạo khoảng trống giữa các cột */}
        {/* Cột bên trái: Bố cục 1 đến 4 */}
        <div className="w-1/2 space-y-6">
          {" "}
          {/* Sử dụng w-1/2 để chiếm 50% chiều rộng */}
          {/* Bố cục I: Tiêu đề vé điện tử */}
          <div className="text-center">
            <h2
              className="font-bold text-gray-800"
              style={{ fontSize: "28px" }}
            >
              VÉ ĐIỆN TỬ VÀ XÁC NHẬN HÀNH TRÌNH
            </h2>
          </div>
          {/* Bố cục II: Thông tin đặt chỗ */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-bold text-gray-800">
              1. Thông tin đặt chỗ
            </h3>
            <hr />
            <table className="my-3 min-w-full table-auto">
              <tbody>
                <tr>
                  <td className="px-4 py-2 font-semibold text-gray-800">
                    Mã đặt chỗ (số vé):
                  </td>
                  <td className="px-4 py-2 text-gray-700">6820798</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 font-semibold text-gray-800">
                    Trạng thái đặt chỗ:
                  </td>
                  <td className="px-4 py-2 text-gray-700">Đã xác nhận</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold text-gray-800">
                    Ngày đặt:
                  </td>
                  <td className="px-4 py-2 text-gray-700">14/10/2024</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 font-semibold text-gray-800">
                    Tên:
                  </td>
                  <td className="px-4 py-2 text-gray-700">NGUYEN VAN A</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold text-gray-800">
                    Liên lạc:
                  </td>
                  <td className="px-4 py-2 text-gray-700">0123 456 789</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 font-semibold text-gray-800">
                    Email:
                  </td>
                  <td className="px-4 py-2 text-blue-700">admin@example.com</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Bố cục III: Thông tin hành khách */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-bold text-gray-800">
              2. Thông tin hành khách
            </h3>
            <hr />
            <table className="my-3 min-w-full table-auto">
              <tbody>
                <tr>
                  <td className="px-4 py-2 font-semibold text-gray-800">
                    Tên hành khách:
                  </td>
                  <td className="px-4 py-2 text-gray-700">VAN A, NGUYEN</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 font-semibold text-gray-800">
                    Số ghế:
                  </td>
                  <td className="px-4 py-2 text-gray-700">VD8661 - 11B</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Bố cục IV: Thông tin chuyến bay */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-4 text-lg font-bold text-gray-800">
              3. Thông tin chuyến bay
            </h3>
            <hr />
            <table className="my-3 min-w-full table-auto">
              <tbody>
                <tr>
                  <td className="px-4 py-2 font-semibold text-gray-800">
                    Chuyến bay:
                  </td>
                  <td className="px-4 py-2 text-gray-700">VD8661</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 font-semibold text-gray-800">
                    Ngày:
                  </td>
                  <td className="px-4 py-2 text-gray-700">20/Jan/2012</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold text-gray-800">
                    Loại vé:
                  </td>
                  <td className="px-4 py-2 text-gray-700">Promo</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 font-semibold text-gray-800">
                    Khởi hành:
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    08:45 - Hà Nội (HAN)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold text-gray-800">
                    Đến:
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    10:45 - Hồ Chí Minh (SGN)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Cột bên phải: Ticket */}
        {/* Ticket hiện tại */}
        <div className="flex w-1/2 items-start justify-center">
          <div className="box">
            <div className="clip" />
            <ul className="left">
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
            </ul>
            <ul className="right">
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
              <li />
            </ul>
            <div className="ticket">
              <span className="airline">Postsnap</span>
              <span className="airline airlineslip">Postsnap</span>
              <span className="boarding">Boarding pass</span>
              <div className="content">
                <span className="jfk">LHR</span>
                <span className="plane">
                  <svg
                    clipRule="evenodd"
                    fillRule="evenodd"
                    height={60}
                    imageRendering="optimizeQuality"
                    shapeRendering="geometricPrecision"
                    textRendering="geometricPrecision"
                    viewBox="0 0 500 500"
                    width={60}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g stroke="#222">
                      <line
                        fill="none"
                        strokeLinecap="round"
                        strokeWidth={30}
                        x1={300}
                        x2={55}
                        y1={390}
                        y2={390}
                      />
                      <path
                        d="M98 325c-9 10 10 16 25 6l311-156c24-17 35-25 42-50 2-15-46-11-78-7-15 1-34 10-42 16l-56 35 1-1-169-31c-14-3-24-5-37-1-10 5-18 10-27 18l122 72c4 3 5 7 1 9l-44 27-75-15c-10-2-18-4-28 0-8 4-14 9-20 15l74 63z"
                        fill="#222"
                        strokeLinejoin="round"
                        strokeWidth={10}
                      />
                    </g>
                  </svg>
                </span>
                <span className="sfo">SFO</span>
                <span className="jfk jfkslip">LHR</span>
                <span className="plane planeslip">
                  <svg
                    clipRule="evenodd"
                    fillRule="evenodd"
                    height={50}
                    imageRendering="optimizeQuality"
                    shapeRendering="geometricPrecision"
                    textRendering="geometricPrecision"
                    viewBox="0 0 500 500"
                    width={50}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g stroke="#222">
                      <line
                        fill="none"
                        strokeLinecap="round"
                        strokeWidth={30}
                        x1={300}
                        x2={55}
                        y1={390}
                        y2={390}
                      />
                      <path
                        d="M98 325c-9 10 10 16 25 6l311-156c24-17 35-25 42-50 2-15-46-11-78-7-15 1-34 10-42 16l-56 35 1-1-169-31c-14-3-24-5-37-1-10 5-18 10-27 18l122 72c4 3 5 7 1 9l-44 27-75-15c-10-2-18-4-28 0-8 4-14 9-20 15l74 63z"
                        fill="#222"
                        strokeLinejoin="round"
                        strokeWidth={10}
                      />
                    </g>
                  </svg>
                </span>
                <span className="sfo sfoslip">SFO</span>
                <div className="sub-content">
                  <span className="watermark">Postsnap</span>
                  <span className="name">
                    PASSENGER NAME
                    <br />
                    <span>BLOGGS, Joe</span>
                  </span>
                  <span className="flight">
                    FLIGHT N°
                    <br />
                    <span>X3-65C3</span>
                  </span>
                  <span className="gate">
                    GATE
                    <br />
                    <span>11B</span>
                  </span>
                  <span className="seat">
                    SEAT
                    <br />
                    <span>45A</span>
                  </span>
                  <span className="boardingtime">
                    BOARDING TIME
                    <br />
                    <span>8:25PM ON AUGUST 2014</span>
                  </span>
                  <span className="flight flightslip">
                    FLIGHT N°
                    <br />
                    <span>X3-65C3</span>
                  </span>
                  <span className="seat seatslip">
                    SEAT
                    <br />
                    <span>45A</span>
                  </span>
                  <span className="name nameslip">
                    PASSENGER NAME
                    <br />
                    <span>BLOGGS, Joe</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
