const PassengerTable = ({ passengers }) => (
  <div className="h-[400px] overflow-auto rounded-lg border border-gray-200 p-3 shadow">
    <h3 className="mb-4 text-lg font-semibold">
      Hành khách có chuyến trong bay hôm nay
    </h3>
    {passengers.length === 0 ? (
      <p className="text-center text-gray-500">No passengers today</p>
    ) : (
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Flight Number</th>
            <th className="border px-4 py-2">Departure Time</th>
          </tr>
        </thead>
        <tbody>
          {passengers.map((passenger) => (
            <tr key={passenger.id} className="text-center">
              <td className="border px-4 py-2">{passenger.id}</td>
              <td className="border px-4 py-2">
                {passenger.firstName} {passenger.lastName}
              </td>
              <td className="border px-4 py-2">
                {passenger.booking.tickets[0]?.flightNumber || "N/A"}
              </td>
              <td className="border px-4 py-2">
                {passenger.booking.tickets[0]
                  ? new Date(
                      passenger.booking.tickets[0].departureTime,
                    ).toLocaleString("vi-VN", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default PassengerTable;
