// src/pages/ProductPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams to get ID from URL
import axios from 'axios';
import { useCart } from '../contexts/CartContext'; // For Add to Cart functionality
import './ProductPage.css'; // We'll create this CSS file

function ProductPage() {
  // Get the product ID from the URL parameters using the useParams hook
  // e.g., if URL is /product/123, productId will be "123"
  const { id: productId } = useParams();
  const { addToCart } = useCart(); // Get addToCart function from our CartContext

  // State for storing the fetched product details
  const [product, setProduct] = useState(null);
  // State for loading status
  const [loading, setLoading] = useState(true);
  // State for storing any errors during fetch
  const [error, setError] = useState('');
  // State for the quantity selector
  const [qty, setQty] = useState(1);

  // useEffect hook to fetch product details when the component mounts or productId changes
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        setError(''); // Clear any previous errors

        // Make GET request to the backend API for the specific product
        // The path is relative, so it will use the proxy in development
        // (e.g., http://localhost:5000/api/products/123)
        // In production, it will be https://shop.isaiah.tech/api/products/123
        const { data } = await axios.get(`/api/products/${productId}`);

        setProduct(data); // Store the fetched product data in state
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        // Handle errors from the API call
        setError(
          err.response && err.response.data.message
            ? err.response.data.message // Use error message from backend if available
            : err.message // Otherwise, use the generic error message
        );
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    if (productId) { // Only fetch if productId is available
      fetchProduct();
    }
  }, [productId]); // Re-run this effect if the productId in the URL changes

  // Handler for adding the product to the cart
  const handleAddToCart = () => {
    if (product && qty > 0) { // Ensure product is loaded and quantity is valid
      addToCart(product, qty); // Call the addToCart function from CartContext
      alert(`${qty} of ${product.name} added to cart!`); // Simple confirmation
    }
  };

  // --- Conditional Rendering based on loading/error state ---
  if (loading) {
    return <div className="product-page-container"><p>Loading product details...</p></div>;
  }

  if (error) {
    return <div className="product-page-container product-page-error"><p>Error: {error}</p></div>;
  }

  if (!product) {
    // This case might be hit if the product ID is invalid or product isn't found
    return <div className="product-page-container"><p>Product not found.</p></div>;
  }

  // --- Render Product Details ---
  return (
    <div className="product-page-container">
      {/* Link to go back to the homepage */}
      <Link to="/" className="product-page-back-link">
        &larr; Go Back
      </Link>

      {/* Grid layout for product details */}
      <div className="product-details-grid">
        {/* Section for the product image */}
        <div className="product-image-section">
          <img
            src={product.image}
            alt={product.name}
            className="product-details-image"
            onError={(e) => { // Fallback image if the main image fails to load
                e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                e.target.src = '/images/placeholder.png';
            }}
          />
        </div>

        {/* Section for product information (name, rating, price, description) */}
        <div className="product-info-section">
          <h1 className="product-details-name">{product.name}</h1>
          <div className="product-details-rating">
            Rating: {product.rating} from {product.numReviews} reviews
          </div>
          <p className="product-details-price">${product.price.toFixed(2)}</p>
          <p className="product-details-description">
            <strong>Description:</strong> {product.description}
          </p>
        </div>

        {/* Section for actions like price, status, quantity, add to cart button */}
        <div className="product-action-section">
          <div className="action-card">
            <div className="action-card-row">
              <span>Price:</span>
              <strong>${product.price.toFixed(2)}</strong>
            </div>
            <div className="action-card-row">
              <span>Status:</span>
              <span>
                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity selector - only show if product is in stock */}
            {product.countInStock > 0 && (
              <div className="action-card-row">
                <label htmlFor="qty-select">Qty:</label>
                <select
                  id="qty-select"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="qty-select-input"
                >
                  {/* Create options from 1 up to countInStock */}
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              className="add-to-cart-button"
              disabled={product.countInStock === 0} // Disable if out of stock
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Placeholder for Reviews section - to be implemented later */}
      {/*
      <div className="product-reviews-section">
        <h2>Reviews</h2>
        <p>No reviews yet.</p>
        {/* Form to add a review could go here for logged-in users *}
      </div>
      */}
    </div>
  );
}

export default ProductPage;

