import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/SignupPage.css"; // Import the CSS file

const SignupPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Correct usage of useNavigate

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        phoneNumber,
        password,
      });

      console.log("Registration response:", response.data); // Log successful response
      // Redirect to login page after successful registration
      navigate("/login");
    } catch (err) {
      // Log the full error for debugging
      console.error("Error during signup:", err);

      // Check if the error has a response and handle accordingly
      if (err.response && err.response.data) {
        // Server-side error message
        setError(err.response.data.msg || "Error occurred during signup.");
      } else {
        // Network or other error
        setError("Error occurred during signup. Please try again.");
      }
    }
  };

  return (
    <div className="signup-page">
      <h2 className="signup-heading">Signup</h2>
      {error && <p className="signup-error">{error}</p>}
      <form className="signup-form" onSubmit={handleSignup}>
        <div className="signup-input-group">
          <label className="signup-label">Phone Number:</label>
          <input
            type="text"
            className="signup-input"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="signup-input-group">
          <label className="signup-label">Password:</label>
          <input
            type="password"
            className="signup-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="signup-button">Sign up</button>
      </form>

      <p className="signup-login-link">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default SignupPage;
