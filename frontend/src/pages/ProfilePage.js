// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css'; // We'll create this CSS file

function ProfilePage() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Get user info (which includes the token) from local storage
      const userInfoFromStorage = localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null;

      if (!userInfoFromStorage || !userInfoFromStorage.token) {
        // If no token/user info, redirect to login
        console.log('No user info found, redirecting to login.');
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        setError('');

        // Prepare the headers for the authenticated request
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfoFromStorage.token}`, // Send the token
          },
        };

        // Fetch user profile data from the backend
        // This request will go to https://shop.isaiah.tech/api/auth/profile in production
        console.log('Fetching profile with token:', userInfoFromStorage.token);
        const { data } = await axios.get('/api/auth/profile', config);
        setUserProfile(data);
        setLoading(false);
      } catch (err) {
        const errorMessage = err.response && err.response.data.message
            ? err.response.data.message
            : err.message;
        setError(errorMessage);
        console.error("Error fetching profile:", err); // Log the full error

        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            // If unauthorized (e.g., token expired or invalid), clear local storage and redirect
            console.log('Unauthorized or token issue, logging out and redirecting.');
            localStorage.removeItem('userInfo');
            navigate('/login');
        }
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]); // navigate is a stable function, good practice to include if used in effect

  if (loading) {
    return <div className="profile-container"><p className="loading-text">Loading profile...</p></div>;
  }

  if (error) {
    return <div className="profile-container profile-error"><p>Error: {error}</p></div>;
  }

  if (!userProfile) {
    // This case might be hit briefly before redirect or if something unexpected happens
    return <div className="profile-container"><p>Could not load profile. You might need to log in again.</p></div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">User Profile</h1>
      <div className="profile-details">
        <div className="profile-detail-item">
          <span className="profile-label">Name:</span>
          <span className="profile-value">{userProfile.name}</span>
        </div>
        <div className="profile-detail-item">
          <span className="profile-label">Email:</span>
          <span className="profile-value">{userProfile.email}</span>
        </div>
        {/* You can add more profile details here later, e.g., order history */}
      </div>
      {/* Placeholder for "Update Profile" or "Order History" links/buttons */}
      {/*
      <div className="profile-actions">
        <button className="profile-button">Update Profile</button>
        <button className="profile-button">My Orders</button>
      </div>
      */}
    </div>
  );
}

export default ProfilePage;

