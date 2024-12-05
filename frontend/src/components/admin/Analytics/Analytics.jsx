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
import axios from "axios";
import MetricsCards from './MetricsCards';
import SalesChart from './SalesChart';
import CategoryDistribution from './CategoryDistribution';
import OrderStatusChart from './OrderStatusChart';
import OrdersPerDay from './OrdersPerDay';

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
        const token = JSON.parse(localStorage.getItem("user"))?.token;
        const [salesResponse, orderResponse] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/adminAnalytics/sales?period=${period}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
          axios.get("http://localhost:5000/api/adminAnalytics/orders", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
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
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

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

      <MetricsCards metrics={analyticsData.metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart salesData={analyticsData.salesData} />
        <CategoryDistribution categoryData={analyticsData.metrics.categoryDistribution} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStatusChart orderStatusData={orderStatusData} />
        <OrdersPerDay salesData={analyticsData.salesData} />
      </div>
    </div>
  );
}

export default Analytics;