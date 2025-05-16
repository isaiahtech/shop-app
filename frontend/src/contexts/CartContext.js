// src/contexts/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cartItems');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse cartItems from localStorage", error);
      return [];
    }
  });

  // Effect to persist cartItems to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Function to add an item to the cart
  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x._id === product._id);
      if (existItem) {
        // If item already exists, update its quantity
        return prevItems.map((x) =>
          x._id === product._id ? { ...x, qty: x.qty + qty } : x
        );
      } else {
        // If new item, add it to the cart with all necessary product details
        return [...prevItems, {
          _id: product._id, // Product's unique ID
          name: product.name,
          image: product.image,
          price: product.price,
          countInStock: product.countInStock, // Useful for cart validation later
          qty // The quantity being added
        }];
      }
    });
  };

  // Function to remove an item completely from the cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((x) => x._id !== productId)
    );
  };

  // Function to update the quantity of a specific item in the cart
  const updateCartItemQuantity = (productId, qty) => {
    setCartItems((prevItems) => {
      if (qty <= 0) { // If new quantity is 0 or less, remove the item
        return prevItems.filter((x) => x._id !== productId);
      }
      // Otherwise, update the quantity of the matching item
      return prevItems.map((x) =>
        x._id === productId ? { ...x, qty: Number(qty) } : x
      );
    });
  };

  // Function to clear all items from the cart
  const clearCart = () => {
    setCartItems([]); // Set cart items to an empty array in the state
    localStorage.removeItem('cartItems'); // Also remove from local storage for persistence
    console.log('Cart cleared.'); // Optional: log for debugging
  };

  // Calculate total number of items in the cart
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  // Calculate subtotal price of all items in the cart
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.qty * item.price), 0);

  // The value object provided by the context to its children
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart, // <<< Make clearCart available through the context
    cartItemCount,
    cartSubtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

