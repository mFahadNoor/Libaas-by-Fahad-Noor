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
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import { CSVLink } from "react-csv";
import MetricsCards from "./Analytics/MetricsCards";
import SalesChart from "./Analytics/SalesChart";
import CategoryDistribution from "./Analytics/CategoryDistribution";
import OrderStatusChart from "./Analytics/OrderStatusChart";
import OrdersPerDay from "./Analytics/OrdersPerDay";

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

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Reports & Analytics", 14, 10);

    if (analyticsData?.metrics) {
      doc.autoTable({
        head: [["Metric", "Value"]],
        body: Object.entries(analyticsData.metrics).map(([key, value]) => [
          key,
          JSON.stringify(value),
        ]),
      });
    }

    if (analyticsData?.salesData) {
      doc.text("Sales Data", 14, doc.lastAutoTable.finalY + 10);
      doc.autoTable({
        head: [["Date", "Sales"]],
        body: analyticsData.salesData.map((data) => [data.date, data.sales]),
      });
    }

    doc.save("analytics-report.pdf");
  };

  const exportToCSV = () => {
    const csvData = [
      ["Metric", "Value"],
      ...Object.entries(analyticsData?.metrics || {}).map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]),
    ];

    const blob = new Blob([csvData.map((row) => row.join(",")).join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, "analytics-report.csv");
  };

  if (loading || !analyticsData) {
    return (
      <div className="flex justify-center items-center h-96">Loading...</div>
    );
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
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Export as CSV
        </button>
      </div>

      <MetricsCards metrics={analyticsData.metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart salesData={analyticsData.salesData} />
        <CategoryDistribution
          categoryData={analyticsData.metrics.categoryDistribution}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStatusChart orderStatusData={orderStatusData} />
        <OrdersPerDay salesData={analyticsData.salesData} />
      </div>
    </div>
  );
}

export default Analytics;
