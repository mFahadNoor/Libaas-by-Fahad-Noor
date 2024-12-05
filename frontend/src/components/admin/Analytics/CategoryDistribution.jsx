import React from 'react';
import { Doughnut } from 'react-chartjs-2';

function CategoryDistribution({ categoryData }) {
  const data = {
    labels: categoryData.map(item => item._id),
    datasets: [{
      data: categoryData.map(item => item.count),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Product Category Distribution'
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Category Distribution</h2>
      <div className="h-80">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

export default CategoryDistribution;