import React from 'react';
import { Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="group relative">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:opacity-75 transition"
        />
        <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition">
          <Heart size={20} />
        </button>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
        <p className="mt-1 text-gray-600">${product.price.toFixed(2)}</p>
      </div>
      <button className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
