import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
function Analytics() {
  const data = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 4500 },
    { month: "May", sales: 6000 },
    { month: "Jun", sales: 5500 },
  ];

  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "Monthly Sales",
        data: data.map((item) => item.sales),
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Sales Chart",
      },
    },
  };
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Sales Reports & Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Monthly Sales Overview</h2>
          <div className="h-80">
            <Line data={chartData} options={options} />
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
