import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  BarChart2,
} from "lucide-react";
import logo from "../../images/logo.png";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    {
      path: "/admin/products",
      icon: <ShoppingBag size={20} />,
      label: "Product Management",
    },
    {
      path: "/admin/orders",
      icon: <ClipboardList size={20} />,
      label: "Order Management",
    },
    {
      path: "/admin/analytics",
      icon: <BarChart2 size={20} />,
      label: "Sales & Analytics",
    },
  ];

  return (
    <div className="bg-white h-full w-64 fixed left-0 top-0 shadow-lg">
      <div className="p-6">
        <img
          src={logo}
          alt="logo"
          className=" h-32 mx-auto mb-4 object-contain object-center"
        />
        <p className="text-sm text-gray-600">Admin Panel</p>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
              location.pathname === item.path
                ? "bg-gray-100 border-r-4 border-black"
                : ""
            }`}
          >
            {item.icon}
            <span className="ml-3">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
