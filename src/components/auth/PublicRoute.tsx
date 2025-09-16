import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../auth/authContext';
import { CircularProgress, Box } from '@mui/material';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
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

  // If user is already logged in, redirect to home page
  if (authContext?.user) {
    return <Navigate to="/" replace />;
  }

  // If user is not logged in, render the public component (login/signup)
  return <>{children}</>;
};

export default PublicRoute;
