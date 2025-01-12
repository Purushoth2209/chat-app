import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie for cookie management
import "./styles/ChatApp.css"; // Import the CSS file

const ChatApp = () => {
  const navigate = useNavigate();

  // Check if the user is logged in when the component mounts
  useEffect(() => {
    const token = Cookies.get("token"); // Get the token from cookies
    if (!token) {
      // If no token, redirect to login page
      navigate("/login");
    }

    // Listen for browser back navigation (history popstate event)
    const handlePopState = () => {
      // Remove the token from cookies and redirect if no token exists
      if (!Cookies.get("token")) {
        Cookies.remove("token"); // Remove the token from cookies
        navigate("/login", { replace: true }); // Redirect to login page
      } else {
        // Optionally, log the user out explicitly when navigating back
        Cookies.remove("token"); // Remove the token
        navigate("/login", { replace: true }); // Redirect to login page
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    Cookies.remove("token"); // Remove the token from cookies
    navigate("/login"); // Redirect to login page after logging out
  };

  return (
    <div className="chat-app-container">
      <h2 className="chat-app-heading">Welcome to the Chat App</h2>
      <p className="chat-app-description">Start chatting here!</p>

      {/* Add a logout button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      {/* Chat interface and functionality would go here */}
    </div>
  );
};

export default ChatApp;
