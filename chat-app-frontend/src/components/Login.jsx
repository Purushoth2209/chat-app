import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './styles/Login.css';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish WebSocket connection when the component mounts
    const socketInstance = io('http://localhost:5000');
    setSocket(socketInstance);

    return () => {
      // Disconnect WebSocket when the component unmounts
      if (socketInstance) socketInstance.disconnect();
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Sending the login request
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { phoneNumber, password }
      );

      // Log the response data for debugging
      console.log('Response from server:', response.data);

      // Check if the login was successful
      if (response.status === 200) {
        // Store the JWT token and user details in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('profileId', response.data.profileId);
        localStorage.setItem('username', response.data.username);

        // Notify the backend about the user's online status
        if (socket) {
          socket.emit('setUser', response.data.profileId);
        }

        // Redirect to the chat app page
        window.location.href = '/chat';
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      // Log error and show a user-friendly message
      console.error('Error during login:', error.response ? error.response.data : error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button type="submit" className="login-btn">Login</button>
      </form>
      <div className="signup-link">
        <a href="/signup">Don't have an account? Sign up</a>
      </div>
    </div>
  );
};

export default Login;
