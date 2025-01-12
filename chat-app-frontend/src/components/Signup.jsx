import React, { useState } from 'react';
import axios from 'axios';
import './styles/Signup.css';

const Signup = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // State for username

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        phoneNumber,
        password,
        username, // Sending username as part of the request
      });

      alert('Registration successful. Please login.');

      // Redirect to login page after successful signup
      window.location.href = '/login';

    } catch (error) {
      if (error.response) {
        // Handle the error from the server
        alert(error.response.data.message);
      } else {
        // Handle other errors (e.g., network issues)
        alert('Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup} className="signup-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="signup-input"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="signup-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signup-input"
        />
        <button type="submit" className="signup-btn">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
