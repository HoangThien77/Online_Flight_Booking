import { useRouter } from "next/navigation";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import Image from "next/image";
import { format } from "date-fns";

const Footer = () => {
  const router = useRouter();

  const handleQuickSearch = (destination) => {
    // Khởi tạo ngày hôm nay
    const today = new Date();
    const vietnamTimeZone = "Asia/Ho_Chi_Minh";
    const formattedDate = format(today.setHours(0, 0, 0, 0), "yyyy-MM-dd", {
      timeZone: vietnamTimeZone,
    });

    // Thiết lập các thông số mặc định cho tìm kiếm
    const defaultParams = {
      engine: "google_flights",
      departure_id: "SGN", // Mặc định từ Hồ Chí Minh
      currency: "VND",
      hl: "vi",
      gl: "vn",
      type: "2", // Một chiều
      travel_class: "1", // Economy
      adults: "1",
      children: "0",
      infants_in_seat: "0",
      infants_on_lap: "0",
      api_key:
        "e03abb5be37ed80732bccb9539d1c81afff47ad32c3e1f2c94c06deab673afab",
    };

    // Map điểm đến với mã sân bay
    const destinationMap = {
      danang: { code: "DAD", city: "Đà Nẵng" },
      hanoi: { code: "HAN", city: "Hà Nội" },
      thailand: { code: "BKK", city: "Bangkok" }, // Thay đổi từ SGN thành BKK cho Thái Lan
      phuquoc: { code: "PQC", city: "Phú Quốc" },
      nhatrang: { code: "CXR", city: "Nha Trang" },
    };

    const destinationInfo = destinationMap[destination];

    if (!destinationInfo) return;

    // Lưu thông tin điểm đến vào localStorage
    localStorage.setItem("destination", destinationInfo.city);
    localStorage.setItem(
      "passengers",
      JSON.stringify({
        adults: 1,
        children: 0,
        infants_in_seat: 0,
        infants_on_lap: 0,
      }),
    );

    // Tạo URL tìm kiếm
    const searchUrl = `/flight-result?engine=${
      defaultParams.engine
    }&departure_id=${encodeURIComponent(
      defaultParams.departure_id,
    )}&arrival_id=${encodeURIComponent(
      destinationInfo.code,
    )}&outbound_date=${formattedDate}&currency=${defaultParams.currency}&hl=${
      defaultParams.hl
    }&gl=${defaultParams.gl}&api_key=${
      defaultParams.api_key
    }&type=${defaultParams.type}&travel_class=${
      defaultParams.travel_class
    }&adults=${defaultParams.adults}&children=${
      defaultParams.children
    }&infants_in_seat=${defaultParams.infants_in_seat}&infants_on_lap=${
      defaultParams.infants_on_lap
    }`;

    router.push(searchUrl);
  };

  return (
    <footer className="bg-gradient-to-b from-[#00264e] to-[#00264e] py-16 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <Image
              src="/images/Logo4.png"
              alt="summertravel.vn logo"
              width={150}
              height={50}
              className="mb-4"
            />
            <p className="text-sm text-gray-300">
              Công Ty TNHH SummerTravel - Chuyên cung cấp dịch vụ đặt vé máy bay
              trực tuyến hàng đầu Việt Nam.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 transition-colors duration-300 hover:text-white"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors duration-300 hover:text-white"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors duration-300 hover:text-white"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors duration-300 hover:text-white"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#fcb41a]">
              Liên Kết Nhanh
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleQuickSearch("danang")}
                  className="transition-colors duration-300 hover:text-[#fcb41a]"
                >
                  Vé máy bay đi Đà Nẵng
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleQuickSearch("hanoi")}
                  className="transition-colors duration-300 hover:text-[#fcb41a]"
                >
                  Vé máy bay đi Hà Nội
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleQuickSearch("thailand")}
                  className="transition-colors duration-300 hover:text-[#fcb41a]"
                >
                  Vé máy bay đi Thái Lan
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleQuickSearch("phuquoc")}
                  className="transition-colors duration-300 hover:text-[#fcb41a]"
                >
                  Vé máy bay đi Phú Quốc
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleQuickSearch("nhatrang")}
                  className="transition-colors duration-300 hover:text-[#fcb41a]"
                >
                  Vé máy bay đi Nha Trang
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#fcb41a]">Hỗ Trợ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="transition-colors duration-300 hover:text-[#fcb41a]"
                >
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors duration-300 hover:text-[#fcb41a]"
                >
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors duration-300 hover:text-[#fcb41a]"
                >
                  Hướng dẫn đặt vé
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors duration-300 hover:text-[#fcb41a]"
                >
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="transition-colors duration-300 hover:text-[#fcb41a]"
                >
                  Phản hồi
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#fcb41a]">Liên Hệ</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <FaPhone className="mr-2 size-4 shrink-0 text-[#fcb41a]" />
                <span>Hotline: 0932 126 988</span>
              </li>
              <li className="flex items-start">
                <FaEnvelope className="mr-2 size-4 shrink-0 text-[#fcb41a]" />
                <span>Email: support@summertravel.vn</span>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="mr-2 size-4 shrink-0 text-[#fcb41a]" />
                <span>
                  8 Nguyễn Văn Tráng, Phường Bến Thành, Quận 1, Hồ Chí Minh
                  700000, Việt Nam
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p className="mb-4">
            © 2024 SummerTravel. Tất cả các quyền được bảo lưu.
          </p>
          <p>
            Vận hành bởi CÔNG TY CỔ PHẦN THƯƠNG MẠI DỊCH VỤ CÔNG NGHỆ
            SUMMERTRAVEL (SummerTravel.vn)
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
