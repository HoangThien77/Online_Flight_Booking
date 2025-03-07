"use client";
import React from "react";
import { Admin, Resource } from "react-admin";

import {
  CustomerCreate,
  CustomerEdit,
  CustomerList,
} from "./Resource/CustomerResource";
import {
  TicketCreate,
  TicketEdit,
  TicketList,
} from "./Resource/TicketResource";
import {
  BookingList,
  BookingEdit,
  BookingCreate,
} from "./Resource/BookingResource";
import { UserCreate, UserEdit, UserList } from "./Resource/UserResource";
import {
  PaymentCreate,
  PaymentEdit,
  PaymentList,
} from "./Resource/PaymentResource";
import Dashboard from "./Dashboard/Dashboard";

import dataProvider from "@/context/dataProvider";

const AdminDashboard = () => (
  <Admin dataProvider={dataProvider} dashboard={Dashboard}>
    <Resource
      name="customers"
      list={CustomerList}
      create={CustomerCreate}
      edit={CustomerEdit}
    />
    <Resource
      name="bookings"
      list={BookingList}
      create={BookingCreate}
      edit={BookingEdit}
    />
    <Resource name="user" list={UserList} create={UserCreate} edit={UserEdit} />
    <Resource
      name="tickets"
      list={TicketList}
      create={TicketCreate}
      edit={TicketEdit}
    />
    <Resource
      name="payments"
      list={PaymentList}
      create={PaymentCreate}
      edit={PaymentEdit}
    />
  </Admin>
);

export default AdminDashboard;
