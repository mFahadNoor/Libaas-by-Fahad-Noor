import React from "react";

function OrderManagement() {
  const orders = [
    {
      id: "#12345",
      customer: "John Doe",
      date: "2024-03-15",
      status: "Processing",
      total: "$245.00",
    },
    {
      id: "#12346",
      customer: "Jane Smith",
      date: "2024-03-14",
      status: "Shipped",
      total: "$189.00",
    },
    {
      id: "#12347",
      customer: "Mike Johnson",
      date: "2024-03-14",
      status: "Delivered",
      total: "$325.00",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Total
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {order.customer}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.total}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-black hover:underline">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderManagement;
