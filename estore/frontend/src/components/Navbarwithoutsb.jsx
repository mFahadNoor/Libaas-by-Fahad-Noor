import React, { useState } from 'react';
import { ShoppingBag, Heart, Menu, X, Truck, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

  return (
    <nav className="bg-black text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/customer">
            <div className="flex-shrink-0 flex items-center space-x-2">
              <h2 className="text-l font-bold mt-0.5">LIBAS by Fahad Noor</h2>
            </div>
          </Link>

          {/* Icons for larger screens */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/wishlist" className="text-white hover:text-gray-500">
              <Heart size={20} />
            </Link>
            <Link to="/cart" className="text-white hover:text-gray-500">
              <ShoppingBag size={20} />
            </Link>
            <Link to="/orders" className="text-white hover:text-gray-500">
              <Truck size={20} />
            </Link>
                <Link to="/reviews" className="text-white hover:text-gray-500"> {/* Navigate to Orders */}
                  <Edit size={20} />
                </Link>
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
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/wishlist" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700">
              Wishlist
            </Link>
            <Link to="/cart" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700">
              Cart
            </Link>
            <Link to="/orders" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700">
              Orders
            </Link>
            <Link to="/reviews" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700">
              Reviews
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
