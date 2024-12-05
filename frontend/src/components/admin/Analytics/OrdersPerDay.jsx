import React from 'react';
import { Bar } from 'react-chartjs-2';

function OrdersPerDay({ salesData }) {
  const data = {
    labels: salesData.map(item => item._id),
    datasets: [{
      label: 'Orders per Day',
      data: salesData.map(item => item.orders.length),
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
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
        text: 'Daily Order Volume'
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
      <h2 className="text-xl font-bold mb-4">Daily Order Volume</h2>
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default OrdersPerDay;