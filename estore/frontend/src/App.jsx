// App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Product from './pages/Product';
import CustomerHomePage from './pages/CustomerHomePage';
import Wishlist from './pages/Wishlist';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  // Function to handle search and pass the term to CustomerHomePage
  const handleSearch = (searchQuery) => {
    setSearchTerm(searchQuery);  // Update the search term in the state
  };

  return (
    <BrowserRouter>
      {/* <Navbar onSearch={handleSearch} /> */}
      <Routes>
        {/* Route for Customer Home Page */}
        <Route path="/" element={<CustomerHomePage searchTerm={searchTerm} />} />

        {/* Route for Product Details Page */}
        <Route path="/products/:productId" element={<Product />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
