import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './styles/LoginPage.css';

const LoginPage = () => {
  const [phoneNumber, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Input validation
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Phone number must be a 10-digit number');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        phoneNumber: phoneNumber.trim(),
        password: password.trim(),
      }, { withCredentials: true }); // Include cookies in the request

      if (response.status === 200) {
        // Successfully logged in, navigate to the next page (e.g., /chat)
        navigate("/chat");
      } else {
        setError('Unexpected response from the server. Please try again.');
      }
    } catch (err) {
      if (err.response) {
        // Handle errors from the server
        const serverError = err.response.data?.msg || 'Invalid credentials. Please try again.';
        setError(serverError);
      } else if (err.request) {
        // If there's no response from the server
        setError('Unable to connect to the server. Please check your connection.');
      } else {
        // Unexpected errors
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin} className="login-form">
        <h2 className="login-heading">Login</h2>
        {error && <div className="login-error">{error}</div>}

        <div className="login-input-group">
          <label htmlFor="phoneNumber" className="login-label">Phone Number</label>
          <input
            type="text"
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhone(e.target.value)}
            className="login-input"
            placeholder="Enter your 10-digit phone number"
          />
        </div>

        <div className="login-input-group">
          <label htmlFor="password" className="login-label">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
