import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; 
import ProductCard from '../components/ProductCard.jsx';
import Newsletter from '../components/Newsletter.jsx';
import Footer from '../components/Footer.jsx';
import HeroImage from '../images/HeroImage.avif';

function CustomerHomePage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); 

  const [wishlist, setWishlist] = useState([]); // State to hold wishlist

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      const categoryQuery = selectedCategory === 'all' ? '' : `category=${selectedCategory}`;
      const genderQuery = selectedGender === 'all' ? '' : `gender=${selectedGender}`;
      const brandQuery = selectedBrand ? `brand=${selectedBrand}` : '';
      const searchQuery = searchTerm ? `name=${searchTerm}` : '';

      const query = [categoryQuery, genderQuery, brandQuery, searchQuery].filter(Boolean).join('&');
      const apiUrl = `http://localhost:5000/api/products${query ? `?${query}` : ''}`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        
        // If the response doesn't have 'id', map it to have 'id' from '_id'
        const formattedData = data.map(product => ({
          ...product,
          id: product._id || product.id // Handle if '_id' is used
        }));

        setProducts(formattedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedGender, selectedBrand, searchTerm]);

  // Function to handle adding to wishlist
  const handleAddToWishlist = (productId) => {
    setWishlist((prevWishlist) => {
      // Check if the product is already in the wishlist
      if (prevWishlist.includes(productId)) {
        alert('Product already in wishlist');
        return prevWishlist;
      }
      return [...prevWishlist, productId];
    });
    alert('Product added to wishlist: ' + productId);
  };

  // Function to handle search query
  const handleSearch = (query) => {
    setSearchTerm(query); 
  };

  // Function to handle clear search and reset filters
  const handleClearSearch = () => {
    setSearchTerm(''); // Clear search term
    setSelectedCategory('all'); // Reset category filter
    setSelectedGender('all'); // Reset gender filter
    setSelectedBrand(''); // Reset brand filter
  };

  return (
    <>
      <Navbar onSearch={handleSearch} />

      <div className="relative h-[70vh] bg-cover bg-center" style={{ backgroundImage: `url(${HeroImage})` }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Summer Collection 2024</h1>
            <p className="text-xl mb-8">Discover the latest trends in fashion</p>
            <button className="bg-white text-black px-8 py-3 rounded-md hover:bg-gray-100 transition">
              Shop Now
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filters */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-4 flex-wrap">
            {['all', 'essentials', 'outerwear', 'pants', 'dresses', 'shoes'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md capitalize ${selectedCategory === category ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Filters for Brand and Gender */}
        <div className="flex">
          <div className="mb-12 mr-6 flex flex-col justify-items-center">
            <label htmlFor="brandSelect" className="block font-semibold text-sm mb-2 text-center">
              Select Brand
            </label>
            <select
              id="brandSelect"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-4 py-2 rounded-md border bg-gray-100 border-gray-300"
            >
              <option value="">All Brands</option>
              <option value="nike">Nike</option>
              <option value="adidas">Adidas</option>
              <option value="puma">Puma</option>
              <option value="asics">Asics</option>
              <option value="newbalance">New Balance</option>
            </select>
          </div>

          <div className="mb-12">
            <label htmlFor="genderSelect" className="block font-semibold text-sm mb-2 text-center">
              Select Gender
            </label>
            <select
              id="genderSelect"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300"
            >
              <option value="">All</option>
              <option value="female">Women</option>
              <option value="male">Men</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

        {/* Clear Button */}
            <div className="mt-7 mb-12 ml-6">
            <button
                onClick={handleClearSearch}
                className="px-6 py-2  text-center bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
                Clear Filters
            </button>
            </div>
        </div>

        {/* Display Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToWishlist={handleAddToWishlist} // Pass function to ProductCard
              />
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>

      <Newsletter />
      <Footer />
    </>
  );
}

export default CustomerHomePage;
