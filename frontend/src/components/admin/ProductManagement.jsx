import React from "react";
import { Plus } from "lucide-react";

function ProductManagement() {
  const products = [
    {
      id: 1,
      name: "Classic White Shirt",
      category: "Shirts",
      price: "$59.99",
      stock: 45,
    },
    {
      id: 2,
      name: "Denim Jeans",
      category: "Pants",
      price: "$89.99",
      stock: 32,
    },
    {
      id: 3,
      name: "Summer Dress",
      category: "Dresses",
      price: "$79.99",
      stock: 28,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <button className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
          <Plus size={20} className="mr-2" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Category
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {product.price}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {product.stock}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-black hover:underline mr-4">
                    Edit
                  </button>
                  <button className="text-red-600 hover:underline">
                    Delete
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

export default ProductManagement;
