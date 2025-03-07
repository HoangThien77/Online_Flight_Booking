import * as React from "react";
import EventIcon from "@mui/icons-material/Event";

import CardWithIcon from "./CardWithIcon";

const NbNewBooking = (props) => {
  const { value } = props;

  return (
    <CardWithIcon
      to="/orders"
      icon={EventIcon}
      title="Số lượng booking mới"
      subtitle={value}
    />
  );
};

export default NbNewBooking;
