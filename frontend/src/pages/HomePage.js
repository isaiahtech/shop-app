// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './HomePage.css'; // Styles for homepage layout

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await axios.get('/api/products');
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="homepage-container">
      {/* Products Section - Now the main content */}
      <section className="products-section">
        <h1 className="section-title">Our Products</h1> {/* Changed from h2 to h1 for main page title */}
        {loading ? (
          <p className="loading-text">Loading products...</p>
        ) : error ? (
          <p className="homepage-error">{error}</p>
        ) : products.length === 0 ? (
          <p className="info-text">No products found. Try seeding the database!</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;

