import * as React from "react";
import EventIcon from "@mui/icons-material/Event";

import CardWithIcon from "./CardWithIcon";

const TotalBooking = (props) => {
  const { value } = props;

  return (
    <CardWithIcon
      to="/orders"
      icon={EventIcon}
      title="Tổng lượt booking"
      subtitle={value}
    />
  );
};

export default TotalBooking;
