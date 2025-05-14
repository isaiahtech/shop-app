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

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x._id === product._id);
      if (existItem) {
        return prevItems.map((x) =>
          x._id === product._id ? { ...x, qty: x.qty + qty } : x
        );
      } else {
        return [...prevItems, { ...product, qty }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((x) => x._id !== productId)
    );
  };

  const updateCartItemQuantity = (productId, qty) => {
    setCartItems((prevItems) => {
      if (qty <= 0) { // If quantity is 0 or less, remove the item
        return prevItems.filter((x) => x._id !== productId);
      }
      return prevItems.map((x) =>
        x._id === productId ? { ...x, qty: Number(qty) } : x
      );
    });
  };

  // Function to clear the cart
  const clearCart = () => {
    setCartItems([]); // Set cart items to an empty array
    localStorage.removeItem('cartItems'); // Also clear from local storage
    console.log('Cart cleared.');
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart, // <<< ADD clearCart TO CONTEXT VALUE
    cartItemCount,
    cartSubtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

