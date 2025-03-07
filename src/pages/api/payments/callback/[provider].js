// pages/api/payments/callback/[provider].js
export default async function handler(req, res) {
  // After successful payment processing
  const script = `
      <script>
        localStorage.removeItem("selectedOutboundFlight");
        localStorage.removeItem("selectedReturnFlight");
        localStorage.removeItem("flightType");
        localStorage.removeItem("totalPrice");
        localStorage.removeItem("destination");
        localStorage.removeItem("passengerInfo");
        window.location.href = '/payment-success?bookingId=${bookingId}';
      </script>
    `;

  res.send(script);
}
