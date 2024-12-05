import React from 'react';

function MetricsCards({ metrics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-gray-600 mb-2">Total Orders</h3>
        <p className="text-3xl font-bold">{metrics.totalOrders}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-gray-600 mb-2">Average Order Value</h3>
        <p className="text-3xl font-bold">${metrics.averageOrderValue.toFixed(2)}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-gray-600 mb-2">Total Customers</h3>
        <p className="text-3xl font-bold">{metrics.totalCustomers}</p>
      </div>
    </div>
  );
}

export default MetricsCards;