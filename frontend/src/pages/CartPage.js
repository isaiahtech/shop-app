// src/pages/CartPage.js
import React, { useState } from 'react'; // Added useState for loading/error
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import axios from 'axios'; // To make API calls
import './CartPage.css';

function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateCartItemQuantity,
    cartSubtotal,
    clearCart, // We'll need to add clearCart to CartContext
  } = useCart();

  const navigate = useNavigate();
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const handleCheckout = async () => {
    setLoadingCheckout(true);
    setCheckoutError('');

    const userInfoFromStorage = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (!userInfoFromStorage || !userInfoFromStorage.token) {
      navigate('/login?redirect=/cart'); // Redirect to login if not authenticated
      setLoadingCheckout(false);
      return;
    }

    // --- Prepare order data ---
    // In a real app, tax and shipping would be calculated more robustly,
    // possibly on the backend or based on user's address.
    // For now, we'll use simplified values or assume they are part of cartSubtotal if applicable.
    const itemsPrice = cartSubtotal;
    const shippingPrice = itemsPrice > 100 ? 0 : 10; // Example: free shipping over $100
    const taxPrice = parseFloat((0.10 * itemsPrice).toFixed(2)); // Example: 10% tax
    const totalPrice = parseFloat((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    const orderData = {
      orderItems: cartItems.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id, // Send product ID
      })),
      // For simplicity, using default shippingAddress from backend model if not provided
      // shippingAddress: { address: '123 Main St', city: 'Anytown' }, // Example
      paymentMethod: 'SimulatedPayment', // Placeholder
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    };

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfoFromStorage.token}`,
        },
      };

      // Make POST request to create order
      const { data: createdOrder } = await axios.post('/api/orders', orderData, config);

      console.log('Order created:', createdOrder);
      // clearCart(); // Clear the cart from context and localStorage
      // navigate(`/order/${createdOrder._id}`); // Redirect to an order details page (to be created)
      // For now, redirect to a simple success message or profile
      alert('Order placed successfully! (Order ID: ' + createdOrder._id + ')');
      if (typeof clearCart === 'function') { // Check if clearCart exists
        clearCart();
      } else {
        console.warn("clearCart function not found in CartContext. Cart not cleared automatically.");
        // Fallback: Manually clear localStorage for cartItems if clearCart is not available
        localStorage.removeItem('cartItems');
        // You might need to force a re-render or use window.location.reload() if Navbar doesn't update
      }
      navigate('/profile'); // Or a dedicated order success page

    } catch (err) {
      const message = err.response && err.response.data.message
        ? err.response.data.message
        : err.message;
      console.error('Checkout error:', message);
      setCheckoutError(message);
    } finally {
      setLoadingCheckout(false);
    }
  };


  if (cartItems.length === 0) {
    return (
      <div className="cart-container cart-empty">
        <h1 className="cart-title">Your Shopping Cart</h1>
        <p>Your cart is currently empty.</p>
        <Link to="/" className="cart-continue-shopping">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Shopping Cart</h1>
      {checkoutError && <p className="cart-error-message">{checkoutError}</p>}
      <div className="cart-items-list">
        {cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <div className="cart-item-image-container">
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/placeholder.png';
                }}
              />
            </div>
            <div className="cart-item-details">
              <Link to={`/product/${item._id}`} className="cart-item-name">
                {item.name}
              </Link>
              <p className="cart-item-price">${item.price.toFixed(2)}</p>
            </div>
            <div className="cart-item-quantity">
              <label htmlFor={`qty-${item._id}`} className="sr-only">Quantity</label>
              <input
                type="number"
                id={`qty-${item._id}`}
                className="cart-item-quantity-input"
                value={item.qty}
                onChange={(e) => {
                    const newQty = parseInt(e.target.value, 10);
                    if (newQty >= 0) { // Allow 0 to trigger removal in updateCartItemQuantity
                        updateCartItemQuantity(item._id, newQty);
                    }
                }}
                min="0" // Allow setting to 0, which should remove it
              />
            </div>
            <div className="cart-item-subtotal">
              <p>${(item.qty * item.price).toFixed(2)}</p>
            </div>
            <div className="cart-item-actions">
              <button
                onClick={() => removeFromCart(item._id)}
                className="cart-item-remove-button"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2 className="cart-summary-title">Cart Summary</h2>
        <div className="cart-summary-row">
          <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items):</span>
          <span className="cart-summary-total">${cartSubtotal.toFixed(2)}</span>
        </div>
        {/* Simplified pricing for now */}
        <div className="cart-summary-row">
            <span>Shipping:</span>
            <span>${(cartSubtotal > 100 ? 0 : 10).toFixed(2)}</span>
        </div>
        <div className="cart-summary-row">
            <span>Tax (10%):</span>
            <span>${(0.10 * cartSubtotal).toFixed(2)}</span>
        </div>
        <div className="cart-summary-row cart-grand-total">
            <span>Total:</span>
            <span>${(cartSubtotal + (cartSubtotal > 100 ? 0 : 10) + (0.10 * cartSubtotal)).toFixed(2)}</span>
        </div>

        <button
          className="cart-checkout-button"
          disabled={cartItems.length === 0 || loadingCheckout}
          onClick={handleCheckout}
        >
          {loadingCheckout ? 'Processing...' : 'Proceed to Checkout'}
        </button>
        <Link to="/" className="cart-continue-shopping cart-continue-shopping-bottom">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default CartPage;

