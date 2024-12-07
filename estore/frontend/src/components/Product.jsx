import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import axios from 'axios';

function Product() {
  const { productId } = useParams(); // Extract product ID from the URL
  const [product, setProduct] = React.useState(null);
  const [reviews, setReviews] = React.useState([]); // State for reviews
  const [loading, setLoading] = React.useState(true);

  // Fetch product details and reviews when component loads
  React.useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        // Fetch product details
        const productResponse = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(productResponse.data);

        // Fetch reviews for the product
        const reviewsResponse = await axios.get(`http://localhost:5000/api/review/${productId}`);
        setReviews(reviewsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching product or reviews:', error);
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [productId]);

  const addToCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage
      
      if (!user || !user.id) {
        throw new Error('User not logged in');
      }
  
      const userId = user.id; // Extract the user ID from the user object in localStorage
  
      await axios.post('http://localhost:5000/api/cart/add', {
        user: userId,
        productId,
        quantity: 1,
      });
      
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  

  // Calculate average rating and number of reviews
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  // Show loading indicator while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  const averageRating = calculateAverageRating();
  const reviewCount = reviews.length;

  return (
    <>
      <Navbar />
      <div className="max-w-screen-lg mx-auto p-6">
        {/* Product Details */}
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
            <p className="text-lg text-gray-600 mb-6">{product.description}</p>
            <p className="text-2xl font-semibold text-gray-800 mb-4">Price: ${product.price}</p>

            {/* Average Rating and Reviews */}
            <p className="text-sm text-gray-600 mb-4">
              Average Rating: {averageRating} <br /> ({reviewCount}  reviews)
            </p>

            {/* Add to Cart Button */}
            <button
              onClick={addToCart}
              className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition duration-200 mb-4 w-full lg:w-auto"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="my-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Customer Reviews</h2>
          <div>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="bg-gray-100 p-4 rounded-lg mb-4">
                  <div className="flex items-center mb-2">
                    <div className="text-yellow-500">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.review}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to review!</p>
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
