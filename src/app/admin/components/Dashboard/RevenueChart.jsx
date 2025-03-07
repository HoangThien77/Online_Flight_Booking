// RevenueChart.js
import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardHeader, CardContent } from "@mui/material";
import { format } from "date-fns";

import { fillMissingDays } from "@/utils";

const RevenueChart = ({ data }) => {
  const filledData = fillMissingDays(data);

  const dateFormatter = (dateStr) => format(new Date(dateStr), "MM/dd");

  const currencyFormatter = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <Card className="w-full">
      <CardHeader title="Monthly Revenue" />
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer>
            <AreaChart data={filledData}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                name="Date"
                type="category"
                tickFormatter={dateFormatter}
              />
              <YAxis
                dataKey="revenue"
                name="Revenue"
                unit=""
                tickFormatter={currencyFormatter}
                width={100}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value) => currencyFormatter(value)}
                labelFormatter={(label) => dateFormatter(label)}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                strokeWidth={2}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
