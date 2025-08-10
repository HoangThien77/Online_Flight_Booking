"use client";

import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";

import FlightDetails from "./components/FlightDetails";
import TicketInfo from "./components/TicketInfo";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import QRCodePayment from "./components/QRCodePayment";

import { countries } from "@/lib/countries";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createStripePayment,
  createMomoPayment,
  createStripeQRPayment,
} from "@/services/payments";

export default function BookingDetailsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // States
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants_in_seat: 0,
    infants_on_lap: 0,
  });

  const [passengersInfo, setPassengersInfo] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [flightDetails, setFlightDetails] = useState({
    outbound: null,
    return: null,
  });
  const [flightType, setFlightType] = useState("1");
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showQRPayment, setShowQRPayment] = useState(false);
  const [qrPaymentData, setQRPaymentData] = useState(null);
  const [bookingId, setBookingId] = useState(null);

  // Functions
  const handleInputChange = (field, value) => {
    setPassengersInfo({
      ...passengersInfo,
      [field]: value,
    });
  };

  const validateForm = () => {
    return passengersInfo.every(
      (passenger) =>
        passenger.lastName &&
        passenger.firstName &&
        passenger.gender &&
        passenger.dob &&
        passenger.nationality,
    );
  };

  const clearFlightData = () => {
    localStorage.removeItem("selectedOutboundFlight");
    localStorage.removeItem("selectedReturnFlight");
    localStorage.removeItem("flightType");
    localStorage.removeItem("totalPrice");
    localStorage.removeItem("destination");
    localStorage.removeItem("passengersInfo");
  };

  const handlePaymentSuccess = () => {
    clearFlightData();
    router.push(`/payment-success?bookingId=${bookingId}`);
  };

  const handleBookingSubmit = async () => {
    if (!session) {
      const currentUrl = window.location.pathname;

      localStorage.setItem("passengersInfo", JSON.stringify(passengersInfo));
      router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);

      return;
    }

    if (!paymentMethod) {
      setErrorMessage("Vui lòng chọn phương thức thanh toán.");

      return;
    }

    // Kiểm tra xem có thông tin chuyến bay không
    if (!flightDetails?.outbound) {
      setErrorMessage("Không tìm thấy thông tin chuyến bay.");

      return;
    }

    try {
      const isRoundTrip = flightType === "1";
      const destination = localStorage.getItem("destination");

      // Kiểm tra null cho outbound flights
      if (
        !flightDetails.outbound?.flights ||
        flightDetails.outbound.flights.length === 0
      ) {
        setErrorMessage("Không tìm thấy thông tin chuyến bay.");

        return;
      }

      const tickets = flightDetails.outbound.flights.map((flight) => ({
        flightNumber: flight.flight_number,
        airline: flight.airline,
        departureAirport: flight.departure_airport.id,
        arrivalAirport: flight.arrival_airport.id,
        departureTime: new Date(flight.departure_airport.time),
        arrivalTime: new Date(flight.arrival_airport.time),
        travelClass: flight.travel_class,
        total_duration: flight.duration,
        tripType: "Outbound",
        seatNumber: "24B",
      }));

      // Kiểm tra null cho return flights nếu là chuyến khứ hồi
      if (isRoundTrip && flightDetails.return?.flights) {
        const returnTickets = flightDetails.return.flights.map((flight) => ({
          flightNumber: flight.flight_number,
          airline: flight.airline,
          departureAirport: flight.departure_airport.id,
          arrivalAirport: flight.arrival_airport.id,
          departureTime: new Date(flight.departure_airport.time),
          arrivalTime: new Date(flight.arrival_airport.time),
          travelClass: flight.travel_class,
          total_duration: flight.duration,
          tripType: "Return",
          seatNumber: "24B",
        }));

        tickets.push(...returnTickets);
      }

      // Lấy giá vé một cách an toàn
      const outboundAmount = flightDetails.outbound?.price || 0;
      const returnAmount =
        isRoundTrip && flightDetails.return?.price
          ? flightDetails.return.price
          : 0;

      const bookingData = {
        isRoundTrip,
        destination,
        passengers: passengersInfo,
        totalAmount: totalPrice,
        outboundAmount,
        returnAmount,
        tickets,
        customers: passengersInfo.map((passenger) => ({
          firstName: passenger.firstName,
          lastName: passenger.lastName,
          dateOfBirth: passenger.dob,
          nationality: passenger.nationality,
          gender: passenger.gender,
        })),
        user: {
          email: session?.user?.email,
        },
      };

      // Tiếp tục với phần code xử lý booking và thanh toán...
      const response = await axios.post("/api/bookings", bookingData);
      const newBookingId = response.data.booking.id;
      const pnr = response.data.booking.pnr;

      if (!newBookingId) {
        setErrorMessage("Không thể lấy ID đặt chỗ.");

        return;
      }

      setBookingId(newBookingId);

      // Xử lý thanh toán dựa trên phương thức được chọn
      if (paymentMethod === "stripe_qr") {
        const qrResult = await createStripeQRPayment({
          totalPrice,
          flightType: flightType === "1" ? "Khứ hồi" : "Một chiều",
          airlineName: flightDetails.outbound.flights[0].airline,
          airlineLogos: flightDetails.outbound.flights.map(
            (flight) => flight.airline_logo,
          ),
          user: session.user,
          bookingId: newBookingId,
        });

        if (qrResult) {
          setQRPaymentData(qrResult);
          setShowQRPayment(true);
        }
      } else if (paymentMethod === "stripe") {
        const stripeResult = await createStripePayment({
          bookingId: newBookingId,
          user: session.user,
        });

        clearFlightData();
        window.location.href = stripeResult.url;
      } else if (paymentMethod === "momo") {
        const momoResult = await createMomoPayment({
          totalAmount: totalPrice,
          orderInfo: `Đặt vé máy bay cho ${session.user.name || "Khách hàng"}`,
          bookingId: newBookingId,
          user: session.user,
        });

        clearFlightData();
        window.location.href = momoResult.payUrl;
      }
    } catch (error) {
      setErrorMessage(error.message || "Đã xảy ra lỗi khi tạo booking.");
      console.error(error);
    }
  };

  const handlePassengerInfoChange = (index, field, value) => {
    const newPassengersInfo = [...passengersInfo];

    newPassengersInfo[index] = {
      ...newPassengersInfo[index],
      [field]: value,
    };
    setPassengersInfo(newPassengersInfo);
  };

  // Effects
  useEffect(() => {
    const outboundFlight = localStorage.getItem("selectedOutboundFlight");
    const returnFlight = localStorage.getItem("selectedReturnFlight");
    const storedFlightType = localStorage.getItem("flightType");
    const storedTotalPrice = localStorage.getItem("totalPrice");
    const storedPassengers = localStorage.getItem("passengers");

    console.log("🔍 Debug - Stored data:", {
      outboundFlight: !!outboundFlight,
      returnFlight: !!returnFlight,
      storedFlightType,
      storedTotalPrice,
      storedPassengers,
    });

    if (outboundFlight) {
      setFlightDetails({
        outbound: JSON.parse(outboundFlight),
        return: returnFlight ? JSON.parse(returnFlight) : null,
      });
    }

    if (storedTotalPrice) {
      setTotalPrice(JSON.parse(storedTotalPrice));
    }

    if (storedFlightType) {
      setFlightType(storedFlightType);
    }

    // Initialize passengersInfo with fallback
    let newPassengersInfo = [];

    if (storedPassengers) {
      try {
        const parsedPassengers = JSON.parse(storedPassengers);

        console.log("🔍 Debug - Parsed passengers:", parsedPassengers);

        // Add adult passengers
        for (let i = 0; i < parsedPassengers.adults; i++) {
          newPassengersInfo.push({
            type: "adult",
            lastName: "",
            firstName: "",
            gender: "",
            dob: null,
            nationality: "Việt Nam",
          });
        }

        // Add child passengers
        for (let i = 0; i < parsedPassengers.children; i++) {
          newPassengersInfo.push({
            type: "child",
            lastName: "",
            firstName: "",
            gender: "",
            dob: null,
            nationality: "Việt Nam",
          });
        }

        // Add infant passengers
        for (
          let i = 0;
          i <
          parsedPassengers.infants_in_seat + parsedPassengers.infants_on_lap;
          i++
        ) {
          newPassengersInfo.push({
            type: "infant",
            lastName: "",
            firstName: "",
            gender: "",
            dob: null,
            nationality: "Việt Nam",
          });
        }
      } catch (error) {
        console.error("Error parsing passengers:", error);
        // Fallback to default passenger if parsing fails
        newPassengersInfo = [
          {
            type: "adult",
            lastName: "",
            firstName: "",
            gender: "",
            dob: null,
            nationality: "Việt Nam",
          },
        ];
      }
    } else {
      // Fallback: if no stored passengers, create at least one adult passenger
      console.log("🔍 Debug - No stored passengers, creating fallback");
      newPassengersInfo = [
        {
          type: "adult",
          lastName: "",
          firstName: "",
          gender: "",
          dob: null,
          nationality: "Việt Nam",
        },
      ];
    }

    console.log("🔍 Debug - Final passengersInfo:", newPassengersInfo);
    setPassengersInfo(newPassengersInfo);

    // Also update the passengers state for consistency
    if (storedPassengers) {
      try {
        const parsedPassengers = JSON.parse(storedPassengers);

        setPassengers(parsedPassengers);
      } catch (error) {
        console.error("Error parsing passengers for state:", error);
        setPassengers({
          adults: 1,
          children: 0,
          infants_in_seat: 0,
          infants_on_lap: 0,
        });
      }
    }
  }, []);

  // Additional safety net: ensure passengersInfo always has at least one passenger
  useEffect(() => {
    if (passengersInfo.length === 0) {
      console.log(
        "🔍 Debug - passengersInfo is empty, adding fallback passenger",
      );
      setPassengersInfo([
        {
          type: "adult",
          lastName: "",
          firstName: "",
          gender: "",
          dob: null,
          nationality: "Việt Nam",
        },
      ]);
    }
  }, [passengersInfo.length]);

  // Render
  return (
    <div>
      {/* Debug Info - Remove this after fixing */}
      {console.log("🔍 Debug - Render passengersInfo:", passengersInfo)}

      {/* Header */}
      <div
        className="relative flex w-full items-center justify-between px-8 py-4 text-white"
        style={{ height: "150px", backgroundColor: "#00264e" }}
      ></div>

      {/* Main Content */}
      <div className="-mt-20 flex min-h-screen items-start justify-center bg-gray-100">
        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 p-4 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Flight Details */}
            <FlightDetails
              flightType={flightType}
              flightDetails={flightDetails}
            />

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
                {errorMessage}
              </div>
            )}

            {/* Passenger Information Form */}
            <div className="mb-6 overflow-hidden rounded-xl bg-white shadow-lg">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
                <h2 className="text-2xl font-bold text-white">
                  Thông tin hành khách
                </h2>
                <p className="mt-2 text-sm text-blue-100">
                  Vui lòng điền đầy đủ thông tin cho tất cả hành khách
                </p>
              </div>

              {/* Passenger Forms Container */}
              <div className="p-6">
                {passengersInfo.map((passenger, index) => (
                  <div
                    key={index}
                    className="group relative mb-8 rounded-lg border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 last:mb-0 hover:border-blue-200 hover:shadow-md"
                  >
                    {/* Passenger Form Header */}
                    <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                          {index + 1}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {passenger.type === "adult" && (
                            <span className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-2 size-5 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              Người lớn
                            </span>
                          )}
                          {passenger.type === "child" && (
                            <span className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-2 size-5 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Trẻ em
                            </span>
                          )}
                          {passenger.type === "infant" && (
                            <span className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-2 size-5 text-pink-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                              </svg>
                              Em bé
                            </span>
                          )}
                        </h3>
                      </div>
                      <div className="text-sm text-gray-500">
                        Hành khách {index + 1}
                      </div>
                    </div>

                    {/* Grid Form Fields */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {/* Họ */}
                      <div className="group relative">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Họ <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 transition duration-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 group-hover:border-blue-200"
                          placeholder="Nhập họ"
                          type="text"
                          value={passenger.lastName}
                          onChange={(e) =>
                            handlePassengerInfoChange(
                              index,
                              "lastName",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      {/* Tên */}
                      <div className="group relative">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Tên đệm và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 transition duration-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 group-hover:border-blue-200"
                          placeholder="Nhập tên đệm và tên"
                          type="text"
                          value={passenger.firstName}
                          onChange={(e) =>
                            handlePassengerInfoChange(
                              index,
                              "firstName",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      {/* Ngày sinh */}
                      <div className="group relative">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Ngày sinh <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 transition duration-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 group-hover:border-blue-200"
                          value={
                            passenger.dob && !isNaN(new Date(passenger.dob))
                              ? new Date(passenger.dob)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) => {
                            const dateValue = e.target.value;
                            const isValidDate = !isNaN(new Date(dateValue));

                            handlePassengerInfoChange(
                              index,
                              "dob",
                              isValidDate ? new Date(dateValue) : null,
                            );
                          }}
                          max={new Date().toISOString().split("T")[0]}
                        />
                      </div>

                      {/* Giới tính */}
                      <div className="group relative">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Giới tính <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={passenger.gender}
                          onValueChange={(value) =>
                            handlePassengerInfoChange(index, "gender", value)
                          }
                        >
                          <SelectTrigger className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 transition duration-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 group-hover:border-blue-200">
                            <SelectValue placeholder="Chọn giới tính" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="male"
                              className="flex items-center"
                            >
                              <span className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="mr-2 size-4 text-blue-500"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Nam
                              </span>
                            </SelectItem>
                            <SelectItem
                              value="female"
                              className="flex items-center"
                            >
                              <span className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="mr-2 size-4 text-pink-500"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Nữ
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Quốc tịch */}
                      <div className="group relative">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Quốc tịch <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={passenger.nationality}
                          onValueChange={(value) =>
                            handlePassengerInfoChange(
                              index,
                              "nationality",
                              value,
                            )
                          }
                        >
                          <SelectTrigger className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 transition duration-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 group-hover:border-blue-200">
                            <SelectValue placeholder="Chọn quốc tịch" />
                          </SelectTrigger>
                          <SelectContent className="max-h-48 overflow-y-auto">
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Tips for infant */}
                    {passenger.type === "infant" && (
                      <div className="mt-4 rounded-lg bg-blue-50 p-4">
                        <div className="flex items-start">
                          <svg
                            className="mr-3 size-5 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-sm text-blue-700">
                            Em bé phải dưới 2 tuổi tại thời điểm khởi hành
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Tips và quy định chung */}
              <div className="border-t border-gray-100 bg-gray-50 p-6">
                <div className="flex items-start space-x-3">
                  <svg
                    className="size-6 text-yellow-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Lưu ý quan trọng
                    </h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                      <li>
                        Vui lòng điền đầy đủ họ tên như trên giấy tờ tùy thân
                      </li>
                      <li>
                        Thông tin ngày sinh phải chính xác để đảm bảo chính sách
                        giá vé
                      </li>
                      <li>
                        Quý khách sẽ cần xuất trình giấy tờ tùy thân khi làm thủ
                        tục bay
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-6 text-xl font-bold text-gray-800">
                Phương thức thanh toán
              </h2>
              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onMethodSelect={setPaymentMethod}
              />
              <div className="mt-8 flex justify-end">
                <button
                  className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={handleBookingSubmit}
                >
                  Tiếp tục thanh toán
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <TicketInfo
              flightType={flightType}
              flightDetails={flightDetails}
              totalPrice={totalPrice}
              passengersInfo={passengersInfo}
            />
          </div>
        </div>
      </div>

      {/* QR Payment Modal */}
      {showQRPayment && qrPaymentData && (
        <QRCodePayment
          qrCodeUrl={qrPaymentData.qrCodeUrl}
          url={qrPaymentData.url}
          sessionId={qrPaymentData.sessionId}
          onPaymentSuccess={() => {
            clearFlightData();
            router.push(`/payment-success?bookingId=${bookingId}`);
          }}
          onPaymentError={(error) => {
            setErrorMessage(error);
            setShowQRPayment(false);
          }}
          onClose={() => {
            setShowQRPayment(false);
            setQRPaymentData(null);
          }}
        />
      )}
    </div>
  );
}
