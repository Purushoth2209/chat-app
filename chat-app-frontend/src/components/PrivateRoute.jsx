import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = ({ component: Component }) => {
  const isAuthenticated = Cookies.get('jwtToken'); 

  console.log("Token from cookie:", isAuthenticated);  

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Component />;
};

export default PrivateRoute;
