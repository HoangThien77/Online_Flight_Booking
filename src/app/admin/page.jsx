import React from "react";
import dynamic from "next/dynamic";

import AdminLayout from "./layout";

const AdminDashboard = dynamic(() => import("./components/AdminDashboard"), {
  ssr: false,
});

const AdminPage = () => (
  <AdminLayout>
    <AdminDashboard />
  </AdminLayout>
);

export default AdminPage;
