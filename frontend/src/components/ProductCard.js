    // src/components/ProductCard.js
    import React from 'react';
    import { Link } from 'react-router-dom'; // To link to product details page
    import './ProductCard.css';
    import { useCart } from '../contexts/CartContext';

    // Component to display a single product
    function ProductCard({ product }) {
      const { addToCart } = useCart();

      const handleAddToCart = () => {
        addToCart(product, 1);
        alert(`${product.name} added to cart!`);
      };

      return (
        <div className="product-card">
          {/* Link to the specific product's details page */}
          <Link to={`/product/${product._id}`}>
            <img
              src={product.image}
              alt={product.name}
              className="product-card-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/placeholder.png';
              }}
            />
          </Link>

          <div className="product-card-body">
            {/* Link to the specific product's details page */}
            <Link to={`/product/${product._id}`}>
              <h3 className="product-card-name">{product.name}</h3>
            </Link>

            <p className="product-card-price">${product.price.toFixed(2)}</p>
            <div className="product-card-rating">
              <span>Rating: {product.rating}</span> ({product.numReviews} reviews)
            </div>
            <button className="product-card-button" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      );
    }

    export default ProductCard;
    
