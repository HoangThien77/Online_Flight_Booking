import path from "path";

import PDFDocument from "pdfkit";

export async function generateInvoicePDF(bookingData) {
  return new Promise((resolve, reject) => {
    try {
      // Create PDF with explicit font configuration
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        bufferPages: true,
        lang: "vi",
        autoFirstPage: true,
      });

      let buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        let pdfData = Buffer.concat(buffers);

        resolve(pdfData);
      });

      // Font configuration
      const fontPath = path.join(process.cwd(), "public", "fonts");

      doc.registerFont("NotoSans", path.join(fontPath, "NotoSans-Regular.ttf"));
      doc.registerFont(
        "NotoSans-Bold",
        path.join(fontPath, "NotoSans-Bold.ttf"),
      );
      doc.font("NotoSans");

      // Logo
      const logoPath = path.join(
        process.cwd(),
        "public",
        "images",
        "Logo4.png",
      );

      doc.image(logoPath, 50, 40, { width: 130 });

      // Header
      doc
        .font("NotoSans-Bold")
        .fontSize(14)
        .text("MÃ HÓA ĐƠN", 450, 50)
        .fontSize(12)
        .text(`#${bookingData.pnrId}`, 450, 70);

      // Title and customer info
      doc.font("NotoSans-Bold").fontSize(24).text("HÓA ĐƠN", 50, 130);
      doc
        .fontSize(14)
        .text(
          `${bookingData.customers[0].firstName} ${bookingData.customers[0].lastName}`,
          50,
          180,
        );

      // Customer details
      doc
        .font("NotoSans")
        .fontSize(10)
        .text("Email:", 50, 210)
        .text(bookingData.user.email, 120, 210)
        .text("Quốc tịch:", 50, 230)
        .text(bookingData.customers[0].nationality || "Vietnam", 120, 230);

      // Table headers
      const startY = 280;

      doc
        .font("NotoSans-Bold")
        .fontSize(10)
        .text("MỤC", 50, startY)
        .text("SỐ LƯỢNG", 300, startY)
        .text("ĐƠN GIÁ", 400, startY)
        .text("THÀNH TIỀN", 480, startY);

      // Header line
      doc
        .moveTo(50, startY + 20)
        .lineTo(550, startY + 20)
        .stroke();

      // Table content
      let currentY = startY + 40;
      let subTotal = 0;

      // Lọc và nhóm vé theo chiều bay
      const outboundFlights = bookingData.tickets.filter(
        (t) => t.tripType === "Outbound",
      );
      const returnFlights = bookingData.tickets.filter(
        (t) => t.tripType === "Return",
      );

      // Thêm thông tin chuyến đi
      if (outboundFlights.length > 0) {
        const outboundPrice =
          bookingData.outboundAmount ||
          bookingData.outbound?.price ||
          bookingData.totalAmount / 2 ||
          0;

        doc
          .font("NotoSans")
          .text(
            `Vé máy bay ${outboundFlights[0].departureAirport} - ${outboundFlights[0].arrivalAirport}`,
            50,
            currentY,
          )
          .text("1", 320, currentY)
          .text(outboundPrice.toLocaleString("vi-VN"), 400, currentY)
          .text(outboundPrice.toLocaleString("vi-VN"), 490, currentY);

        subTotal += outboundPrice;
        currentY += 30;
      }

      // Thêm thông tin chuyến về nếu có
      if (returnFlights.length > 0) {
        const returnPrice =
          bookingData.returnAmount ||
          bookingData.return?.price ||
          bookingData.totalAmount / 2 ||
          0;

        doc
          .font("NotoSans")
          .text(
            `Vé máy bay ${returnFlights[0].departureAirport} - ${returnFlights[0].arrivalAirport}`,
            50,
            currentY,
          )
          .text("1", 320, currentY)
          .text(returnPrice.toLocaleString("vi-VN"), 400, currentY)
          .text(returnPrice.toLocaleString("vi-VN"), 490, currentY);

        subTotal += returnPrice;
        currentY += 30;
      }

      // Tổng cộng và thuế
      const tax = 0;
      const finalTotal = subTotal;

      currentY += 20;
      doc
        .font("NotoSans")
        .text("Tổng cộng", 400, currentY)
        .text(subTotal.toLocaleString("vi-VN"), 490, currentY);

      currentY += 20;
      doc
        .text("Thuế (0%)", 400, currentY)
        .text(tax.toLocaleString("vi-VN"), 530, currentY);

      currentY += 20;
      doc
        .font("NotoSans-Bold")
        .text("TỔNG THANH TOÁN", 350, currentY)
        .text(finalTotal.toLocaleString("vi-VN"), 490, currentY);

      // Payment information
      currentY += 40;
      doc
        .font("NotoSans-Bold")
        .fontSize(12)
        .text("THÔNG TIN THANH TOÁN", 50, currentY);

      currentY += 25;
      doc
        .font("NotoSans")
        .fontSize(10)
        .text("Ngân hàng:", 50, currentY)
        .text(bookingData.payment.paymentMethod.toUpperCase(), 150, currentY)
        .text("Phí dịch vụ:", 50, currentY + 20)
        .text("0", 150, currentY + 20)
        .text("Số tài khoản:", 50, currentY + 40)
        .text("123-456-789", 150, currentY + 40)
        .text("Ngày thanh toán:", 50, currentY + 60)
        .text(new Date().toLocaleDateString("vi-VN"), 150, currentY + 60);

      doc
        .text("Email:", 300, currentY)
        .text(bookingData.user.email, 380, currentY)
        .text("Điện thoại:", 300, currentY + 40)
        .text(
          bookingData.user.phoneNumber || "(028) 77 777 777",
          380,
          currentY + 40,
        )
        .text("Website:", 300, currentY + 60)
        .text("www.summertravel.vn", 380, currentY + 60);

      doc.end();
    } catch (error) {
      console.error("Error generating PDF:", error);
      reject(error);
    }
  });
}
