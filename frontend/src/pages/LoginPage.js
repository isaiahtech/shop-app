// src/pages/LoginPage.js (Tailwind classes removed)
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import './Form.css'; // Import a shared CSS file for forms (create this file)

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };
      const { data } = await axios.post('/api/auth/login', { email, password }, config);

      console.log('Login successful:', data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate('/');
      window.location.reload(); // Force reload to update Navbar state (simple approach)

    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      setLoading(false);
    }
  };

  return (
    // Add classes for styling the form container
    <div className="form-container">
      <h1 className="form-title">Login</h1>
      {/* Add class for error messages */}
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={handleSubmit} className="form-body">
        {/* Add class for form groups */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            required
            // Add class for form inputs
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            required
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            // Add class for form buttons
            className="form-button"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
         <div className="form-link-container">
            New Customer? <Link to="/register" className="form-link">Register</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;

