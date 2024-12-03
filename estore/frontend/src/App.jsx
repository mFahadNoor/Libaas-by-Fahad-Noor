import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import Product from './pages/Product';
import HeroImage from './images/HeroImage.avif';

function App() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      const categoryQuery = selectedCategory === 'all' ? '' : `category=${selectedCategory}`;
      const genderQuery = selectedGender === 'all' ? '' : `gender=${selectedGender}`;
      const query = [categoryQuery, genderQuery].filter(Boolean).join('&');
      const apiUrl = `http://localhost:5000/api/products${query ? `?${query}` : ''}`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedGender]);

  return (
    <Router>
      <Navbar onCategoryChange={(category) => setSelectedCategory(category)} onGenderChange={(gender) => setSelectedGender(gender)} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="relative h-[70vh] bg-cover bg-center" style={{ backgroundImage: `url(${HeroImage})` }}>
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h1 className="text-5xl font-bold mb-4">Summer Collection 2024</h1>
                    <p className="text-xl mb-8">Discover the latest trends in fashion</p>
                    <button className="bg-white text-black px-8 py-3 rounded-md hover:bg-gray-100 transition">Shop Now</button>
                  </div>
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex justify-center mb-12">
                  <div className="flex gap-4 flex-wrap">
                    {['all', 'essentials', 'outerwear', 'pants', 'dresses', 'shoes'].map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-md capitalize ${
                          selectedCategory === category ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.length > 0 ? (
                    products.map((product) => <ProductCard key={product.id} product={product} />)
                  ) : (
                    <p>No products available</p>
                  )}
                </div>
              </div>

              <Newsletter />
              <Footer />
            </>
          }
        />
        <Route path="/products/:productId" element={<Product />} />
      </Routes>
    </Router>
  );
}

export default App;
