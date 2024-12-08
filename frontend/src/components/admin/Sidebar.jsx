import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  BarChart2,
  Menu,
  X,
} from "lucide-react";
import logo from "../../images/logo.png";

function Sidebar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <header className="bg-white shadow-md fixed w-full z-50">
      {/* Top Sidebar */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="logo" className="h-10 object-contain" />
          <p className="ml-3 text-lg font-semibold text-gray-700">
            Admin Panel
          </p>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button
          className="md:hidden p-2 rounded bg-gray-100 hover:bg-gray-200 shadow transition-colors duration-200"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? (
            <X
              size={24}
              className="transform transition-transform duration-200"
            />
          ) : (
            <Menu
              size={24}
              className="transform transition-transform duration-200"
            />
          )}
        </button>

        {/* Links (Desktop) */}
        <nav className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center text-gray-700 hover:text-black transition-colors duration-200 ${
                location.pathname === item.path ? "text-black font-bold" : ""
              }`}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Dropdown Menu (Mobile) */}
      <div
        className={`md:hidden bg-white border-t overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          isMenuOpen ? "max-h-[400px]" : "max-h-0"
        }`}
      >
        <nav className="transform transition-transform duration-300 ease-in-out">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors duration-200 ${
                location.pathname === item.path ? "bg-gray-100 font-bold" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Sidebar;
