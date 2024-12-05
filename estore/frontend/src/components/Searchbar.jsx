import React, { useState } from 'react';

const SearchBar = ({ onSelectProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch suggestions dynamically
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/products?name=${query}`);
      const data = await response.json();
      setSuggestions(data); // Assuming the response is a list of products
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchSuggestions(value);
  };

  // Handle product selection
  const handleSelect = (product) => {
    onSelectProduct(product); // Notify parent component
    setSearchTerm(''); // Clear the input
    setSuggestions([]); // Hide suggestions
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      {isLoading && <p className="absolute top-full mt-1 text-sm text-gray-500">Loading...</p>}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded shadow-md max-h-60 overflow-y-auto">
          {suggestions.map((product) => (
            <li
              key={product._id}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(product)}
            >
              <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{product.name}</span>
                <span className="text-xs text-gray-500">${product.price}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
