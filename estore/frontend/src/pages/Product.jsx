import React from 'react';
import { useParams } from 'react-router-dom';

function Product() {
  const { productId } = useParams(); // Extract the product ID from the URL

  // Simulating product data fetch (replace this with an actual API call)
  const [product, setProduct] = React.useState(null);

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <img src={product.image} alt={product.name} className="w-20 h-20 mb-6" />
      <p className="text-lg mb-4">{product.description}</p>
      <p className="text-xl font-semibold">Price: ${product.price}</p>
    </div>
  );
}

export default Product;
