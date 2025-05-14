// src/pages/RegisterPage.js (Tailwind classes removed)
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import './Form.css'; // Import shared form CSS

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return; // Don't set loading if passwords don't match
    }
    setLoading(true); // Set loading only after password check

    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };
      const { data } = await axios.post('/api/auth/register', { name, email, password }, config);

      console.log('Registration successful:', data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate('/');
      window.location.reload(); // Force reload (simple approach)

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
    // Use shared form container class
    <div className="form-container">
      {/* Use shared form title class */}
      <h1 className="form-title">Register</h1>
      {/* Use shared error class */}
      {error && <p className="form-error">{error}</p>}
      {/* Use shared form body class */}
      <form onSubmit={handleSubmit} className="form-body">
        {/* Use shared form group class */}
        <div className="form-group">
          {/* Use shared form label class */}
          <label htmlFor="name" className="form-label">
            Name
          </label>
          {/* Use shared form input class */}
          <input
            type="text"
            id="name"
            required
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            required
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
            minLength="6"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            required
            className="form-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
          />
        </div>
        <div>
          {/* Use shared form button class */}
          <button
            type="submit"
            disabled={loading}
            className="form-button"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
        <div className="form-link-container">
             Already have an account? <Link to="/login" className="form-link">Login</Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;

