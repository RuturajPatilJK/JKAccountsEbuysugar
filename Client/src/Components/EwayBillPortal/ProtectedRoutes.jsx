import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = () => {
    return !!sessionStorage.getItem('access_token');
  };

  return isAuthenticated() ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;
