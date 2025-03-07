import React from "react";
import DollarIcon from "@mui/icons-material/AttachMoney";

import CardWithIcon from "./CardWithIcon";

const TotalRevenue = ({ value }) => {
  return (
    <CardWithIcon
      to="/orders"
      icon={DollarIcon}
      title="Tổng doanh thu"
      subtitle={value + " VND"}
    />
  );
};

export default TotalRevenue;
