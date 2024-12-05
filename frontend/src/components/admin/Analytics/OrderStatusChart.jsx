import React from 'react';
import { Bar } from 'react-chartjs-2';

function OrderStatusChart({ orderStatusData }) {
  const data = {
    labels: orderStatusData.map(item => item._id),
    datasets: [{
      label: 'Orders by Status',
      data: orderStatusData.map(item => item.count),
      backgroundColor: [
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
      ],
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Order Status Distribution'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Orders'
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Order Status Distribution</h2>
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default OrderStatusChart;