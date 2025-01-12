import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ChatApp from "./components/ChatApp";
import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* Use PrivateRoute to protect the /chat route */}
        <Route path="/chat" element={<PrivateRoute component={ChatApp} />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
