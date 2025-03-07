import axios from "axios";

export default async function handler(req, res) {
  console.log("Request query:", req.query);
  const {
    engine,
    departure_id,
    arrival_id,
    outbound_date,
    return_date,
    currency = "VND",
    hl = "vi",
    gl = "vn",
    api_key,
    type = "1",
    departure_token,
    travel_class = "1",
    adults = 1,
    children = 0,
    infants_in_seat = 0,
    infants_on_lap = 0,
  } = req.query;

  // Log lại thông tin hành khách nhận được để kiểm tra
  console.log("Thông tin hành khách nhận được từ client:");
  console.log("Người lớn:", adults);
  console.log("Trẻ em:", children);
  console.log("Trẻ sơ sinh có ghế:", infants_in_seat);
  console.log("Trẻ sơ sinh ngồi cùng người lớn:", infants_on_lap);
  console.log("Received travel_class from client:", travel_class);

  const vietnamTimeZone = "Asia/Ho_Chi_Minh";
  const currentDateTime = new Date(
    new Date().toLocaleString("en-US", { timeZone: vietnamTimeZone }),
  );

  console.log("Thời gian thực hiện tại (theo giờ Việt Nam):", currentDateTime);

  const formattedOutboundDate = outbound_date
    ? new Date(outbound_date).toLocaleDateString("en-CA", {
        timeZone: vietnamTimeZone,
      })
    : null;
  const formattedReturnDate = return_date
    ? new Date(return_date).toLocaleDateString("en-CA", {
        timeZone: vietnamTimeZone,
      })
    : null;

  console.log("Ngày đi đã chuyển đổi:", formattedOutboundDate);
  console.log("Ngày về đã chuyển đổi:", formattedReturnDate);

  if (
    !engine ||
    !departure_id ||
    !arrival_id ||
    !formattedOutboundDate ||
    !api_key
  ) {
    return res.status(400).json({
      error:
        "Thiếu tham số yêu cầu: engine, departure_id, arrival_id, outbound_date, api_key.",
    });
  }

  const url = "https://serpapi.com/search.json";
  const params = {
    engine,
    departure_id,
    arrival_id,
    outbound_date: formattedOutboundDate,
    currency,
    hl,
    gl,
    api_key,
    type,
    travel_class,
    adults,
    children,
    infants_in_seat,
    infants_on_lap,
  };

  if (departure_token) {
    params.departure_token = departure_token;
  }

  if (formattedReturnDate && type !== "2") {
    params.return_date = formattedReturnDate;
  }

  console.log("Các tham số gửi đến API:", params);

  try {
    const response = await axios.get(url, { params });

    console.log("Kết quả từ API:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu chuyến bay:", error.message);
    res.status(500).json({
      error: "Đã xảy ra lỗi khi lấy dữ liệu chuyến bay",
      details: error.message,
    });
  }
}
