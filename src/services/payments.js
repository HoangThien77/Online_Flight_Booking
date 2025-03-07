import axios from "axios";

export const createStripeQRPayment = async ({
  totalPrice,
  flightType,
  airlineName,
  airlineLogos,
  bookingId,
  user,
}) => {
  if (!bookingId) {
    throw new Error("bookingId is required");
  }

  try {
    const response = await axios.post(
      "/api/payments/create-stripe-qr-payment",
      {
        totalPrice,
        flightType,
        airlineName,
        airlineLogos,
        bookingId,
        user,
      },
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error creating Stripe QR payment:",
      error?.response?.data || error,
    );
    throw new Error(
      error?.response?.data?.error || "Không thể tạo thanh toán QR",
    );
  }
};

export const createMomoPayment = async ({ totalAmount, bookingId, user }) => {
  if (totalAmount > 50000000) {
    throw new Error(
      "MoMo không hỗ trợ thanh toán cho số tiền lớn hơn 50 triệu VND.",
    );
  }

  try {
    const response = await axios.post("/api/payments/create-momo-payment", {
      bookingId,
      totalAmount,
      user,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating MoMo payment:", error);
    throw new Error(
      error.response?.data?.message || "MoMo payment creation failed.",
    );
  }
};

export const createStripePayment = async ({ bookingId, user }) => {
  try {
    const response = await axios.post("/api/payments/create-stripe-payment", {
      bookingId,
      user,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating Stripe payment:", error);
    throw new Error(
      error.response?.data?.message || "Stripe payment creation failed.",
    );
  }
};
