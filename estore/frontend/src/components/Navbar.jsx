import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Heart, Search, Menu, X } from 'lucide-react';

function Navbar({ onSearch }) {
  const [isSearchVisible, setIsSearchVisible] = useState(false); // State to track search bar visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // state to hold the search term
  const [searchResults, setSearchResults] = useState([]); // state to hold search results

  const searchRef = useRef(null); // Reference to the search bar dropdown

  const toggleSearchBar = () => {
    setIsSearchVisible(!isSearchVisible); // Toggle visibility of search bar
  };

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchTerm(query); // update search term in the state

    if (!query.trim()) {
      setSearchResults([]); // Clear results if the query is empty
      return;
    }

    try {
      // Make API request to fetch search results (assuming API exists)
      const response = await fetch(`http://localhost:5000/api/search/term/${query}`);
      if (!response.ok) throw new Error('Failed to fetch search results');
      const data = await response.json();
      setSearchResults(data.products || []); // Update state with search results
    } catch (error) {
      console.error(error);
      setSearchResults([]); // Clear results on error
    }

    onSearch(query); // Pass the search term to the parent component
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]); // Close dropdown
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-black text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <h2 className="text-l font-bold mt-0.5">LIBAS by Fahad Noor</h2>
          </div>

          <div className='flex flex-row'>
            {/* Search Bar - Only shows when isSearchVisible is true */}
            {isSearchVisible && (
              <div className="relative" ref={searchRef}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange} // Trigger the search change
                  placeholder="Search..."
                  className="rounded-3xl w-[300px] h-8 px-4 mx-6 text-black focus:outline-none"
                />

                {/* Dropdown for search results */}
                {searchResults.length > 0 && (
                  <div className="absolute bg-white shadow-lg rounded-md mt-2 w-full max-h-64 overflow-y-auto z-10">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSearchTerm(product.name); // Set the search term to selected product name
                          setSearchResults([]); // Clear search results
                          onSearch(product.name); // Pass selected product name to parent for catalog update
                        }}
                      >
                        <img
                          src={product.image} // Assuming image URL is present in product object
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-md mr-3"
                        />
                        <div>
                          <p className="text-sm font-medium text-black">{product.name}</p>
                          <p className="text-xs text-gray-600">${product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Icons */}
            <div className="hidden md:flex items-center space-x-6">
              <button className="text-white hover:text-gray-500" onClick={toggleSearchBar}>
                <Search size={20} />
              </button>
              <button className="text-white hover:text-gray-500">
                <Heart size={20} />
              </button>
              <button className="text-white hover:text-gray-500">
                <ShoppingBag size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white hover:text-gray-500"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Gender Filter Removed */}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
