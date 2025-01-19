import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Chat from './components/chat/Chat';
import './App.css';

// PrivateRoute Component to protect the chat page
const PrivateRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem('token');  // Fetch JWT token from localStorage

  // If token is available, render the component, otherwise redirect to login
  return token ? Component : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/chat"
            element={<PrivateRoute element={<Chat />} />}
          />  {/* Protected route for chat */}
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
