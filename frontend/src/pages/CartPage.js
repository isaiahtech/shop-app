// src/pages/CartPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.js'; // Ensure .js if using ES Modules consistently
import axios from 'axios';
import './CartPage.css'; // Ensure this CSS file is imported and exists

function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateCartItemQuantity,
    cartSubtotal,
    clearCart, // Get clearCart from context
    cartItemCount, // Get cartItemCount for summary
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
      navigate('/login?redirect=/cart');
      setLoadingCheckout(false);
      return;
    }

    const itemsPrice = parseFloat(cartSubtotal.toFixed(2));
    const shippingPrice = itemsPrice > 100 ? 0.00 : 10.00;
    const taxPrice = parseFloat((0.10 * itemsPrice).toFixed(2));
    const totalPrice = parseFloat((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    const orderData = {
      orderItems: cartItems.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id, // This is the Product's ObjectId
      })),
      shippingAddress: { address: '123 Test St', city: 'Testville', postalCode: '12345', country: 'USA' }, // Example
      paymentMethod: 'SimulatedPayment',
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

      const { data: createdOrder } = await axios.post('/api/orders', orderData, config);

      console.log('Order created:', createdOrder);
      alert('Order placed successfully! Order ID: ' + createdOrder._id);

      if (typeof clearCart === 'function') {
        clearCart();
      } else {
        console.warn("clearCart function not found in CartContext. Cart not cleared automatically.");
        localStorage.removeItem('cartItems');
      }
      navigate('/profile'); // Or a dedicated order success page

    } catch (err) {
      const message = err.response && err.response.data.message
        ? err.response.data.message
        : err.message;
      console.error('Checkout error:', err);
      setCheckoutError(message);
    } finally {
      setLoadingCheckout(false);
    }
  };

  const displayShippingPrice = cartSubtotal > 100 ? 0.00 : 10.00;
  const displayTaxPrice = parseFloat((0.10 * cartSubtotal).toFixed(2));
  const displayTotalPrice = parseFloat((cartSubtotal + displayShippingPrice + displayTaxPrice).toFixed(2));

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
                    if (!isNaN(newQty) && newQty >= 0) {
                        updateCartItemQuantity(item._id, newQty);
                    }
                }}
                min="0"
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
          <span>Subtotal ({cartItemCount} items):</span>
          <span className="cart-summary-total">${cartSubtotal.toFixed(2)}</span>
        </div>
        <div className="cart-summary-row">
            <span>Shipping:</span>
            <span>${displayShippingPrice.toFixed(2)}</span>
        </div>
        <div className="cart-summary-row">
            <span>Tax (10%):</span>
            <span>${displayTaxPrice.toFixed(2)}</span>
        </div>
        <div className="cart-summary-row cart-grand-total">
            <span>Total:</span>
            <span>${displayTotalPrice.toFixed(2)}</span>
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

