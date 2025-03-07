import * as handlebars from "handlebars";

const emailTemplate = `
<!DOCTYPE html>
<html>
  <head>
    <title>SummerTravel - Xác Nhận Đặt Vé</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900"
      rel="stylesheet"
      type="text/css"
    />
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      min-width: 100%;
      font-family: Arial, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      background-color: #f9f9f9;
      color: #222222;
    "
  >
    <div style="max-width: 600px; margin: 0 auto;">
      <!-- Logo Header -->
      <div
        style="
          background-color: #00264e;
          padding: 24px;
          border-radius: 8px;
          color: #ffffff;
        "
      >
        <img
          src="https://file.hstatic.net/200000942031/file/logo4.png"
          alt="MyTrip Logo"
          style="width: 250px; display: block; margin: 0 auto;"
        />
      </div>

      <!-- Main Content -->
      <div style="padding: 24px; background-color: #ffffff;">
        <h1
          style="
            font-size: 24px;
            font-weight: 700;
            text-align: center;
            color: #00264e;
            margin-bottom: 20px;
          "
        >
          Cảm ơn bạn đã đặt vé tại SummerTravel
        </h1>

        <p style="margin-bottom: 20px;">Kính gửi {{name}},</p>

        <p style="margin-bottom: 20px;">
          Chúng SummerTravel xin xác nhận đơn đặt vé của bạn đã được thực hiện thành
          công. Dưới đây là chi tiết chuyến bay của bạn:
        </p>

        <!-- Flight Details Box -->
<div style="background-color: #ebedff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
  <h2 style="color: #00264e; font-size: 20px; margin-bottom: 15px;">
    Chi Tiết Chuyến Bay
  </h2>
  <p style="margin: 5px 0;">
    <strong>Mã đặt chỗ (PNR):</strong> {{pnrId}}
  </p>
  <p style="margin: 5px 0;">
    <strong>Hành khách:</strong> {{passengerName}}
  </p>

  <!-- Chiều đi -->
  <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ccc;">
    <h3 style="color: #00264e; font-size: 16px;">
      {{#if isRoundTrip}}Chuyến đi:{{else}}Chuyến bay:{{/if}}
    </h3>
    <p style="margin: 5px 0;">
      <strong>Chuyến bay:</strong> {{outboundFlightNumber}}
    </p>
    <p style="margin: 5px 0;">
      <strong>Điểm khởi hành:</strong> {{outboundDepartureAirport}} - {{outboundDepartureTime}}
    </p>
    <p style="margin: 5px 0;">
      <strong>Điểm đến:</strong> {{outboundArrivalAirport}} - {{outboundArrivalTime}}
    </p>
  </div>

  <!-- Chiều về - Chỉ hiển thị khi là vé khứ hồi -->
  {{#if isRoundTrip}}
  <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ccc;">
    <h3 style="color: #00264e; font-size: 16px;">Chuyến về:</h3>
    <p style="margin: 5px 0;">
      <strong>Chuyến bay:</strong> {{returnFlightNumber}}
    </p>
    <p style="margin: 5px 0;">
      <strong>Điểm khởi hành:</strong> {{returnDepartureAirport}} - {{returnDepartureTime}}
    </p>
    <p style="margin: 5px 0;">
      <strong>Điểm đến:</strong> {{returnArrivalAirport}} - {{returnArrivalTime}}
    </p>
  </div>
  {{/if}}

  <p style="margin: 5px 0;">
    <strong>Hạng vé:</strong> {{travelClass}}
  </p>
</div>

        <!-- Payment Information -->
        <div
          style="
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          "
        >
          <h2 style="color: #00264e; font-size: 20px; margin-bottom: 15px;">
            Thông Tin Thanh Toán
          </h2>
          <p style="margin: 5px 0;">
            <strong>Phương thức thanh toán:</strong> {{paymentMethod}}
          </p>
          <p style="margin: 5px 0;">
            <strong>Tổng tiền:</strong> {{totalAmount}} VNĐ
          </p>
          <p style="margin: 5px 0;">
            <strong>Trạng thái:</strong> Đã thanh toán
          </p>
        </div>

        <!-- Important Notes -->
        <div
          style="
            border-left: 4px solid #00264e;
            padding: 15px;
            background-color: #f8f9fa;
            margin-bottom: 20px;
          "
        >
          <h3 style="color: #00264e; margin-top: 0;">Lưu ý quan trọng:</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>
              Vui lòng có mặt tại sân bay ít nhất 2 tiếng trước giờ khởi hành
            </li>
            <li>Mang theo giấy tờ tùy thân hợp lệ khi làm thủ tục</li>
            <li>Kiểm tra kỹ hành lý trước khi lên máy bay</li>
          </ul>
        </div>

        <!-- Check Booking Button -->
        <div style="text-align: center; margin-top: 30px;">
          <a
            href="{{bookingUrl}}"
            style="
              background-color: #00264e;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
            "
          >
            Kiểm Tra Đặt Chỗ
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div
        style="
          background-color: #0b1560;
          padding: 25px;
          color: #ffffff;
          border-radius: 8px;
          margin-top: 20px;
        "
      >
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;
          "
        >
          <!-- Info Section -->
          <div style="width: 48%; min-width: 200px;">
            <h3
              style="
                font-family: Montserrat, sans-serif;
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
              "
            >
              Info
            </h3>
            <p
              style="
                font-family: Montserrat, sans-serif;
                font-size: 14px;
                color: #c0c0c0;
                line-height: 1.6;
                margin: 0;
              "
            >
              Stay up-to-date with current activities and future events by
              following us on your favorite social media channels.
            </p>
            <div style="margin-top: 15px;">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                style="margin-right: 10px; display: inline-block;"
              >
                <img
                  src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-white/facebook@2x.png"
                  width="32"
                  height="32"
                  alt="Facebook"
                  title="Facebook"
                />
              </a>
              <a
                href="https://www.twitter.com/"
                target="_blank"
                style="margin-right: 10px; display: inline-block;"
              >
                <img
                  src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-white/twitter@2x.png"
                  width="32"
                  height="32"
                  alt="Twitter"
                  title="Twitter"
                />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                style="display: inline-block;"
              >
                <img
                  src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-white/instagram@2x.png"
                  width="32"
                  height="32"
                  alt="Instagram"
                  title="Instagram"
                />
              </a>
            </div>
          </div>

          <!-- Contact Section -->
          <div style="width: 48%; min-width: 200px; margin-left: 10px">
            <h3
              style="
                font-family: Montserrat, sans-serif;
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
              "
            >
              Contact Us
            </h3>
            <p
              style="
                font-family: Montserrat, sans-serif;
                font-size: 14px;
                color: #c0c0c0;
                line-height: 1.6;
                margin: 0;
              "
            >
              www.summertravel.vn<br />
              8 Nguyễn Văn Tráng, Phường Bến Thành, Quận 1, Hồ Chí Minh 700000, Việt Nam<br />
              (028) 77 777 777<br />
              <a
                href="#"
                target="_blank"
                style="
                  color: #c0c0c0;
                  text-decoration: underline;
                  display: inline-block;
                  margin-top: 10px;
                "
              >
                Unsubscribe
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`;

export function compileBookingTemplate(data) {
  const template = handlebars.compile(emailTemplate);

  return template(data);
}
