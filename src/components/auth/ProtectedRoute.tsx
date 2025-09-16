import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../auth/authContext';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);

  // Show loading spinner while checking authentication
  if (authContext?.loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If user is not logged in, redirect to login page
  if (!authContext?.user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
