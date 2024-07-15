import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const auth = useAuth();

  if (auth.loading) {
    return <div>Loading...</div>;
  }

  return auth.login ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;