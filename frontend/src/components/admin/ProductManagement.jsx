import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function ProductManagement() {
  const navigate = useNavigate();
  const Relod = () => {
    navigate(0);
  };
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    brand: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products"); // Fetch products from API
        setProducts(response.data); // Update state with fetched products
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle Filter Changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  // Apply Filters
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...products];

      if (filters.brand) {
        filtered = filtered.filter((p) => p.brand === filters.brand);
      }

      if (filters.category) {
        filtered = filtered.filter((p) => p.category === filters.category);
      }

      if (filters.minPrice) {
        filtered = filtered.filter(
          (p) => p.price >= parseFloat(filters.minPrice)
        );
      }

      if (filters.maxPrice) {
        filtered = filtered.filter(
          (p) => p.price <= parseFloat(filters.maxPrice)
        );
      }

      setFilteredProducts(filtered);
    };

    applyFilters();
  }, [filters, products]);

  // Open Edit Modal
  const handleEditClick = (product) => {
    setSelectedProduct(product);
  };

  // Close Edit Modal
  const handleModalClose = () => {
    setSelectedProduct(null);
    Relod();
  };

  // Save Edited Product
  const handleSave = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      // Log the selectedProduct for debugging
      console.log("Selected Product:", selectedProduct);

      // Send the updated product data directly
      await axios.put(
        `http://localhost:5000/api/products/${selectedProduct._id}`,
        selectedProduct, // Send the selectedProduct directly, not wrapped in another object
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
        }
      );
      // Close the modal or handle the UI update after the successful update
      handleModalClose();
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Management</h1>
      </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-4 gap-4">
        <select
          name="brand"
          value={filters.brand}
          onChange={handleFilterChange}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Brands</option>
          {Array.from(new Set(products.map((p) => p.brand))).map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Categories</option>
          {Array.from(new Set(products.map((p) => p.category))).map(
            (category) => (
              <option key={category} value={category}>
                {category}
              </option>
            )
          )}
        </select>

        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleFilterChange}
          className="border rounded-lg px-4 py-2"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          className="border rounded-lg px-4 py-2"
        />
      </div>

      {/* Products Table */}
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
                Brand
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ${product.price}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {product.brand}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    className="text-blue-600 hover:underline mr-4"
                    onClick={() => handleEditClick(product)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Edit Product</h2>
            <input
              type="text"
              value={selectedProduct.name}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, name: e.target.value })
              }
              placeholder="Product Name"
              className="border rounded-lg w-full px-4 py-2 mb-4"
            />
            <input
              type="number"
              value={selectedProduct.price}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  price: e.target.value,
                })
              }
              placeholder="Price"
              className="border rounded-lg w-full px-4 py-2 mb-4"
            />
            <input
              type="text"
              value={selectedProduct.brand}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  brand: e.target.value,
                })
              }
              placeholder="Brand"
              className="border rounded-lg w-full px-4 py-2 mb-4"
            />
            <input
              type="text"
              value={selectedProduct.category}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  category: e.target.value,
                })
              }
              placeholder="Category"
              className="border rounded-lg w-full px-4 py-2 mb-4"
            />
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg mr-2"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;
