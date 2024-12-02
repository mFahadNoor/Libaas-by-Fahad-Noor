import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, Menu, X } from 'lucide-react';

function Navbar({ onGenderChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleGenderClick = (gender) => {
    onGenderChange(gender);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <h1 className="text-2xl font-bold">Libas</h1>
            <h2 className="text-l font-bold mt-0.5">by Fahad Noor</h2>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleGenderClick('all')}
              className="text-gray-700 hover:text-black"
            >
              All
            </button>
            <button
              onClick={() => handleGenderClick('female')}
              className="text-gray-700 hover:text-black"
            >
              Women
            </button>
            <button
              onClick={() => handleGenderClick('male')}
              className="text-gray-700 hover:text-black"
            >
              Men
            </button>
            <button
              onClick={() => handleGenderClick('unisex')}
              className="text-gray-700 hover:text-black"
            >
              Unisex
            </button>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gray-700 hover:text-black">
              <Search size={20} />
            </button>
            <button className="text-gray-700 hover:text-black">
              <Heart size={20} />
            </button>
            <button className="text-gray-700 hover:text-black">
              <ShoppingBag size={20} />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-black"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => handleGenderClick('all')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-black"
            >
              All
            </button>
            <button
              onClick={() => handleGenderClick('female')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-black"
            >
              Women
            </button>
            <button
              onClick={() => handleGenderClick('male')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-black"
            >
              Men
            </button>
            <button
              onClick={() => handleGenderClick('unisex')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-black"
            >
              Unisex
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
