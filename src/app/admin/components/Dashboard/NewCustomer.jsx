import * as React from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import CardWithIcon from "./CardWithIcon";

const NewCustomer = (props) => {
  const { value } = props;

  return (
    <CardWithIcon
      to="/orders"
      icon={PersonAddIcon}
      title="New customers"
      subtitle={value}
    />
  );
};

export default NewCustomer;
