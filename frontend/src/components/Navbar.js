// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Ensure this CSS file is imported
import { useCart } from '../contexts/CartContext';

// Simple inline SVG for the House Icon
const HouseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="navbar-house-icon" // Class for styling the SVG
  >
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
);

function Navbar() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const { cartItemCount } = useCart();

  // Effect to check localStorage and update userInfo state
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      try {
        setUserInfo(JSON.parse(storedUserInfo));
      } catch (error) {
        console.error("Failed to parse userInfo from localStorage", error);
        localStorage.removeItem('userInfo'); // Clear invalid data
      }
    } else {
      setUserInfo(null); // Explicitly set to null if nothing in storage
    }
  }, []); // Re-run on mount

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null); // Update state to reflect logout
    navigate('/login');
  };

  // This effect listens for changes to localStorage from other tabs/windows
  // and updates the Navbar's userInfo state.
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'userInfo') {
        const storedValue = event.newValue;
        if (storedValue) {
          try {
            setUserInfo(JSON.parse(storedValue));
          } catch (error) {
            console.error("Failed to parse updated userInfo from localStorage", error);
            setUserInfo(null);
            localStorage.removeItem('userInfo');
          }
        } else {
          setUserInfo(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener when component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a
          href="https://www.isaiah.tech"
          className="main-domain-icon-link"
          target="_blank"
          rel="noopener noreferrer"
          title="Go to www.isaiah.tech"
        >
          <HouseIcon />
        </a>

        <Link to="/" className="navbar-brand">
          Shop.Isaiah.Tech
        </Link>

        <div className="navbar-links-group">
          <Link to="/cart" className="nav-link">
            Cart {cartItemCount > 0 && <span className="cart-count">({cartItemCount})</span>}
          </Link>

          {userInfo ? (
            <>
              <Link to="/profile" className="nav-link"> {/* <<< ADDED PROFILE LINK */}
                Profile
              </Link>
              <span className="navbar-user-greeting">Hi, {userInfo.name}!</span>
              <button
                onClick={handleLogout}
                className="navbar-logout-button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

