import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Analytics() {
  const data = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 4500 },
    { month: "May", sales: 6000 },
    { month: "Jun", sales: 5500 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Sales Reports & Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Monthly Sales Overview</h2>
          <div className="h-80">
            {/* <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#000000" />
              </BarChart>
            </ResponsiveContainer> */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Key Metrics</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <p className="text-gray-600 mb-1">Average Order Value</p>
              <p className="text-2xl font-bold">$156.00</p>
            </div>
            <div className="border-b pb-4">
              <p className="text-gray-600 mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold">3.2%</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Customer Retention</p>
              <p className="text-2xl font-bold">68%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
