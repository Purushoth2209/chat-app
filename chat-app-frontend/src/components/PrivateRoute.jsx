import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = ({ component: Component }) => {
  const isAuthenticated = Cookies.get('jwtToken'); // Get the token from cookies

  console.log("Token from cookie:", isAuthenticated);  // Debugging line

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Component />;
};

export default PrivateRoute;
