import { useState, useEffect } from "react";
import axios from "axios";

import ExportDialog from "../Export/ExportDialog";

import PassengerTable from "./PassengerTable";
import TotalRevenue from "./TotalRevenue";
import NbNewBooking from "./NbNewBooking";
import TotalBooking from "./TotalBooking";
import RevenueChart from "./RevenueChart";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("/api/admins/report");

        setData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);
  console.log(data);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-end p-4">
        <ExportDialog />
      </div>
      <div className="flex flex-row justify-between gap-12 p-3">
        {/* Thêm MonthlyRevenue trước chart */}
        <TotalRevenue value={data.totalRevenue.toLocaleString("vi-VN")} />
        <NbNewBooking value={data.newBooking} />
        <TotalBooking value={data.totalBooking} />
      </div>
      <div className="flex gap-4 p-3">
        <div className="w-1/2">
          <RevenueChart data={data.monthlyRevenue} />
        </div>
        <div className="w-1/2">
          <PassengerTable passengers={data.passengersToday} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
