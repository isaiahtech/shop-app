// src/pages/ProductPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // useNavigate might still be useful for other actions
import axios from 'axios';
import { useCart } from '../contexts/CartContext.js'; // Ensure .js if using ES Modules consistently
import './ProductPage.css'; // Ensure this CSS file is imported and exists

function ProductPage() {
  const { id: productId } = useParams(); // Get product ID from URL
  const { addToCart } = useCart();
  const navigate = useNavigate(); // Keep for potential future use, like redirecting after adding to cart

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1); // Default quantity to add to cart

  useEffect(() => {
    console.log(`ProductPage: useEffect triggered for productId: ${productId}`);
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      console.log('ProductPage: Attempting to fetch product details (publicly)...');

      try {
        // Fetch product details. No Authorization header is needed as this is now a public route.
        const { data } = await axios.get(`/api/products/${productId}`);
        console.log('ProductPage: Product data received:', data);
        setProduct(data);
      } catch (err) {
        const errorMessage = err.response && err.response.data.message
            ? err.response.data.message
            : err.message;
        setError(errorMessage);
        console.error("ProductPage: Error fetching product details. Status:", err.response ? err.response.status : 'N/A', "Message:", errorMessage, "Full error:", err);
        // No need to redirect to login for a public product fetch error.
        // The error message will be displayed on the page.
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    } else {
      console.log('ProductPage: No productId found in params.');
      setLoading(false);
      setError('Product ID is missing.');
    }
  }, [productId]); // Only re-run if productId changes

  const handleAddToCart = () => {
    if (product && qty > 0) {
      addToCart(product, qty);
      alert(`${qty} of ${product.name} added to cart!`);
    }
  };

  if (loading) {
    return <div className="product-page-container"><p className="loading-text">Loading product details...</p></div>;
  }

  // If there was an error and no product data was loaded
  if (error && !product) {
    return <div className="product-page-container product-page-error"><p>Error: {error}</p></div>;
  }

  // If no product was found (e.g., invalid ID, or API returned null/empty)
  if (!product) {
    return <div className="product-page-container"><p className="info-text">Product not found.</p></div>;
  }

  // Render product details if product is loaded
  return (
    <div className="product-page-container">
      <Link to="/" className="product-page-back-link">
        &larr; Go Back
      </Link>
      {/* Display error message even if product is loaded, in case a subsequent action failed (not applicable here yet) */}
      {error && <p className="product-page-error" style={{marginBottom: '1rem'}}>Note: {error}</p>}
      <div className="product-details-grid">
        <div className="product-image-section">
          <img
            src={product.image}
            alt={product.name}
            className="product-details-image"
            onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                e.target.src = '/images/placeholder.png'; // Path to your generic placeholder
            }}
          />
        </div>
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
            {product.countInStock > 0 && (
              <div className="action-card-row">
                <label htmlFor="qty-select">Qty:</label>
                <select
                  id="qty-select"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="qty-select-input"
                >
                  {/* Create options from 1 up to countInStock, but max out at a reasonable number like 10 for the dropdown */}
                  {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
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
              disabled={product.countInStock === 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;

