import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="h-16"></div>
      <div className="p-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
