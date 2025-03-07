import prisma from "@/lib/prisma";
import { sendMail } from "@/lib/mail";
import { compileBookingTemplate } from "@/lib/mail/templates/paymentbill";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);

    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { bookingId, status, paymentMethod } = req.body;
    const bookingIdInt = parseInt(bookingId, 10);

    // Verify payment record exists with all necessary related data
    const existingPayment = await prisma.payment.findUnique({
      where: { bookingId: bookingIdInt },
      include: {
        booking: {
          include: {
            user: true,
            tickets: true,
            customers: true,
          },
        },
      },
    });

    if (!existingPayment) {
      console.error("Payment record not found for bookingId:", bookingId);

      return res.status(404).json({
        error: "Payment record not found for the provided bookingId.",
      });
    }

    // Update payment status using payment's id
    const updatedPayment = await prisma.payment.update({
      where: { id: existingPayment.id }, // Use payment id instead of bookingId
      data: {
        status,
        paymentMethod: paymentMethod || existingPayment.paymentMethod, // Keep existing method if not provided
      },
      include: {
        booking: {
          include: {
            user: true,
            tickets: true,
            customers: true,
          },
        },
      },
    });

    // If payment is successful, send confirmation email
    if (status === "successful") {
      try {
        const booking = updatedPayment.booking;
        const user = booking.user;

        // Xác định có phải vé khứ hồi không
        const returnTickets = booking.tickets.filter(
          (t) => t.tripType === "Return",
        );
        const isRoundTrip = returnTickets.length > 0;

        // Chuẩn bị dữ liệu template
        const templateData = {
          name: user.name,
          pnrId: booking.pnrId,
          passengerName: `${booking.customers[0].firstName} ${booking.customers[0].lastName}`,
          isRoundTrip: isRoundTrip, // Thêm flag này vào template data

          // Thông tin chuyến đi
          outboundFlightNumber: booking.tickets
            .filter((t) => t.tripType === "Outbound")
            .map((t) => t.flightNumber)
            .join(" + "),
          outboundDepartureAirport: booking.tickets.find(
            (t) => t.tripType === "Outbound",
          )?.departureAirport,
          outboundDepartureTime: new Date(
            booking.tickets.find(
              (t) => t.tripType === "Outbound",
            )?.departureTime,
          ).toLocaleString("vi-VN"),
          outboundArrivalAirport: booking.tickets
            .filter((t) => t.tripType === "Outbound")
            .slice(-1)[0]?.arrivalAirport,
          outboundArrivalTime: new Date(
            booking.tickets
              .filter((t) => t.tripType === "Outbound")
              .slice(-1)[0]?.arrivalTime,
          ).toLocaleString("vi-VN"),

          // Thông tin chuyến về - chỉ set khi có vé khứ hồi
          ...(isRoundTrip && {
            returnFlightNumber: returnTickets
              .map((t) => t.flightNumber)
              .join(" + "),
            returnDepartureAirport: returnTickets[0]?.departureAirport,
            returnDepartureTime: new Date(
              returnTickets[0]?.departureTime,
            ).toLocaleString("vi-VN"),
            returnArrivalAirport: returnTickets.slice(-1)[0]?.arrivalAirport,
            returnArrivalTime: new Date(
              returnTickets.slice(-1)[0]?.arrivalTime,
            ).toLocaleString("vi-VN"),
          }),

          travelClass: booking.tickets[0].travelClass,
          paymentMethod:
            updatedPayment.paymentMethod === "momo"
              ? "MoMo"
              : updatedPayment.paymentMethod === "stripe"
                ? "Thẻ tín dụng"
                : "Quét mã QR",
          totalAmount: booking.totalAmount.toLocaleString("vi-VN"),
          bookingUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/${booking.pnrId}`,
        };

        // Compile email template with booking data
        const compiledTemplate = compileBookingTemplate(templateData);

        // Send confirmation email
        await sendMail({
          to: user.email,
          name: user.name,
          subject: `Xác nhận đặt vé - Mã đặt chỗ: ${booking.pnrId}`,
          body: compiledTemplate,
          bookingData: {
            ...booking,
            payment: updatedPayment,
            user,
            customers: booking.customers,
            tickets: booking.tickets,
          },
        });

        console.log("Confirmation email sent successfully to:", user.email);
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
      }
    }

    return res.status(200).json({
      message: `Payment status updated to ${status}`,
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);

    return res.status(500).json({
      error: "An error occurred while updating payment status.",
      details: error.message,
    });
  }
}
