import React from "react";
import { Users, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";

function Dashboard() {
  const stats = [
    {
      title: "Total Sales",
      value: "$12,426",
      icon: <DollarSign size={24} />,
      change: "+8.2%",
    },
    {
      title: "Active Orders",
      value: "64",
      icon: <ShoppingBag size={24} />,
      change: "+12.5%",
    },
    {
      title: "New Customers",
      value: "126",
      icon: <Users size={24} />,
      change: "+3.4%",
    },
    {
      title: "Growth Rate",
      value: "24.8%",
      icon: <TrendingUp size={24} />,
      change: "+2.2%",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">{stat.icon}</div>
              <span className="text-green-500 text-sm font-medium">
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b last:border-0"
            >
              <div>
                <p className="font-medium">New order #1234{index}</p>
                <p className="text-sm text-gray-600">2 items • $156.00</p>
              </div>
              <span className="text-sm text-gray-500">2 mins ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
