import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {
  const [period, setPeriod] = useState("monthly");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [orderStatusData, setOrderStatusData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [salesResponse, orderResponse] = await Promise.all([
          axios.get(`/api/adminAnalytics/sales?period=${period}`),
          axios.get("/api/adminAnalytics/orders"),
        ]);

        setAnalyticsData(salesResponse.data);
        setOrderStatusData(orderResponse.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  if (loading || !analyticsData) {
    return (
      <div className="flex justify-center items-center h-96">Loading...</div>
    );
  }

  const salesChartData = {
    labels: analyticsData.salesData.map((item) => item._id),
    datasets: [
      {
        label: "Sales ($)",
        data: analyticsData.salesData.map((item) => item.sales),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Products Sold",
        data: analyticsData.salesData.map((item) => item.products),
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const categoryChartData = {
    labels: analyticsData.metrics.categoryDistribution.map((item) => item._id),
    datasets: [
      {
        data: analyticsData.metrics.categoryDistribution.map(
          (item) => item.count
        ),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const orderStatusChartData = {
    labels: orderStatusData.map((item) => item._id),
    datasets: [
      {
        label: "Orders by Status",
        data: orderStatusData.map((item) => item.count),
        backgroundColor: [
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
        ],
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sales Reports & Analytics</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-600 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold">
            {analyticsData.metrics.totalOrders}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-600 mb-2">Average Order Value</h3>
          <p className="text-3xl font-bold">
            ${analyticsData.metrics.averageOrderValue.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-600 mb-2">Total Customers</h3>
          <p className="text-3xl font-bold">
            {analyticsData.metrics.totalCustomers}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Sales Overview</h2>
          <div className="h-80">
            <Line
              data={salesChartData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Category Distribution</h2>
          <div className="h-80">
            <Doughnut
              data={categoryChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Order Status Distribution</h2>
        <div className="h-80">
          <Bar
            data={orderStatusChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Analytics;
