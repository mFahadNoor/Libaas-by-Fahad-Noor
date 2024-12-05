import React from 'react';
import { useParams } from 'react-router-dom'; // Import useParams for extracting the product ID from the URL
import Navbar from '../components/Navbar'; // Ensure the correct import path for Navbar
import Newsletter from '../components/Newsletter'; // Ensure the correct import path for Newsletter
import Footer from '../components/Footer'; // Ensure the correct import path for Footer

function Product() {
  const { productId } = useParams(); // Extract the product ID from the URL

  // State to store the product data
  const [product, setProduct] = React.useState(null);

  // Dummy data for reviews, description, and related products
  const dummyReviews = [
    { id: 1, rating: 4, comment: "Great product!" },
    { id: 2, rating: 5, comment: "I love this!" },
    { id: 3, rating: 3, comment: "It's okay, could be better." },
  ];

  const dummyRelatedProducts = [
    { id: 1, name: "Related Product 1", image: "/images/product1.jpg", price: 19.99 },
    { id: 2, name: "Related Product 2", image: "/images/product2.jpg", price: 29.99 },
    { id: 3, name: "Related Product 3", image: "/images/product3.jpg", price: 24.99 },
  ];

  // Define handleSearch if you need search functionality
  const handleSearch = (query) => {
    console.log(query); // Handle the search logic here
  };

  React.useEffect(() => {
    // Fetch the product details based on the product ID from the URL
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`); // Replace with your actual API URL
        if (!response.ok) throw new Error('Failed to fetch product');
        const data = await response.json();
        setProduct(data); // Store the fetched product in the state
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };

    fetchProduct();
  }, [productId]); // Refetch product if productId changes

  // If the product is still loading, display a loading message
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>  
      <Navbar onSearch={handleSearch} />
      <div className="max-w-screen-lg mx-auto p-6">
        {/* Product Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12">
          <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="lg:w-1/2 lg:pl-10">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">{product.name}</h1>
            <p className="text-lg text-gray-600 mb-6">This is a dummy description for the product.</p>
            <p className="text-2xl font-semibold text-gray-800 mb-4">Price: ${product.price}</p>

            {/* Reviews Section */}
            <div className="flex items-center mb-6">
              <div className="text-yellow-500">
                {'★★★★☆'}
              </div>
              <span className="ml-2 text-gray-600">({dummyReviews.length} reviews)</span>
            </div>

            {/* Add to Cart Button */}
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200 mb-4 w-full lg:w-auto">
              Add to Cart
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="my-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Customer Reviews</h2>
          <div>
            {dummyReviews.length > 0 ? (
              dummyReviews.map((review) => (
                <div key={review.id} className="bg-gray-100 p-4 rounded-lg mb-4">
                  <div className="flex items-center mb-2">
                    <div className="text-yellow-500">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                    <span className="ml-2 text-gray-600">{review.comment}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        <div className="my-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {dummyRelatedProducts.length > 0 ? (
              dummyRelatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
                >
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800">{relatedProduct.name}</h3>
                    <p className="text-lg text-gray-600 mb-4">This is a related product description.</p>
                    <p className="text-lg font-semibold text-gray-800">Price: ${relatedProduct.price}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No related products available.</p>
            )}
          </div>
        </div>
      </div>
      <Newsletter />
      <Footer />
    </>
  );
}

export default Product;
