import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProductManagement() {
  const navigate = useNavigate();
  const reload = () => {
    navigate(0);
  };

  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    brand: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    brand: "",
    image: "",
    gender: "",
  });
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

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

  const handleEditClick = (product) => {
    setSelectedProduct(product);
  };

  const handleModalClose = () => {
    setSelectedProduct(null);
    reload();
  };

  const handleSave = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/products/${selectedProduct._id}`,
        selectedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleModalClose();
    } catch (error) {
      console.log(selectedProduct);
      console.error("Failed to update product:", error);
    }
  };

  const handleRemove = async (product) => {
    try {
      console.log(product);
      let id = product._id;
      const token = JSON.parse(localStorage.getItem("user"))?.token;

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(products.filter((product) => product._id !== id));
      setFilteredProducts(
        filteredProducts.filter((product) => product._id !== id)
      );
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/products",
        newProduct,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProducts([...products, response.data]);
      setFilteredProducts([...filteredProducts, response.data]);
      setNewProduct({
        name: "",
        category: "",
        price: "",
        brand: "",
        image: "",
        gender: "",
      });
      setIsAddModalVisible(false);
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };
  const handleBulkUpload = async () => {
    if (!bulkUploadFile) {
      console.error("No file selected for upload");
      return;
    }

    const token = JSON.parse(localStorage.getItem("user"))?.token;
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const fileContent = await bulkUploadFile.text();
      const lines = fileContent.split("\n").filter((line) => line.trim());
      const headers = lines[0].split(",").map((header) => header.trim());
      const productsToUpload = lines.slice(1).map((line) => {
        const values = line.split(",").map((value) => value.trim());
        return headers.reduce((acc, header, idx) => {
          acc[header] = values[idx];
          return acc;
        }, {});
      });

      const response = await axios.post(
        "http://localhost:5000/api/products/bulk-upload",
        { products: productsToUpload },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProducts([...products, ...response.data]);
      setFilteredProducts([...filteredProducts, ...response.data]);
      setBulkUploadFile(null);
      alert("Products uploaded successfully!");
    } catch (error) {
      console.error("Failed to upload products:", error);
      alert("An error occurred during the upload.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Management</h1>
      </div>
      <div className="p-8">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setBulkUploadFile(e.target.files[0])}
          className="mr-2"
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={handleBulkUpload}
        >
          Bulk Upload
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg ml-2"
          onClick={() => setIsAddModalVisible(true)}
        >
          Add Product
        </button>
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
      {/* Edit Product Modal */}
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
      {/* Add Product Modal */}
      {isAddModalVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Add New Product</h2>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="border rounded-lg w-full px-4 py-2 mb-4"
            />
            <input
              type="text"
              placeholder="Brand"
              value={newProduct.brand}
              onChange={(e) =>
                setNewProduct({ ...newProduct, brand: e.target.value })
              }
              className="border rounded-lg w-full px-4 py-2 mb-4"
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              className="border rounded-lg w-full px-4 py-2 mb-4"
            />
            <input
              type="text"
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              className="border rounded-lg w-full px-4 py-2 mb-4"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
              className="border rounded-lg w-full px-4 py-2 mb-4"
            />
            <select
              value={newProduct.gender}
              onChange={(e) =>
                setNewProduct({ ...newProduct, gender: e.target.value })
              }
              className="border rounded-lg w-full px-4 py-2 mb-4"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="UNISEX">Unisex</option>
            </select>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg mr-2"
                onClick={() => setIsAddModalVisible(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
                onClick={handleAddProduct}
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-auto">
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
              <tr key={product._id}>
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
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleRemove(product)}
                  >
                    Remove
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
