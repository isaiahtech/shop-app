// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage'; // <<< IMPORT ProfilePage
import Navbar from './components/Navbar';

import './App.css'; // Your global styles

function App() {
  return (
    <Router>
      <Navbar />
      <main className="app-main-container">
        <Routes>
          <Route path="/" element={<HomePage />} exact />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/profile" element={<ProfilePage />} /> {/* <<< ADD ProfilePage Route */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;

