import React from 'react';
import { Line } from 'react-chartjs-2';

function SalesChart({ salesData }) {
  const data = {
    labels: salesData.map(item => item._id),
    datasets: [
      {
        label: "Sales ($)",
        data: salesData.map(item => item.sales),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        yAxisID: 'y',
      },
      {
        label: "Products Sold",
        data: salesData.map(item => item.products),
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Sales ($)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Products Sold'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Sales Overview</h2>
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default SalesChart;