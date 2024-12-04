import React from 'react';

function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">About LIBAS</h3>
            <p className="text-gray-600">
              Discover the latest in fashion with our curated collection of contemporary clothing and accessories.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-black">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Shipping & Returns</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Size Guide</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-black">New Arrivals</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Sale</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Gift Cards</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Store Locator</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-black">Instagram</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Facebook</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Twitter</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black">Pinterest</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} LIBAS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// Export the component for use in other files
export default Footer;
