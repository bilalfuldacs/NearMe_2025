import * as React from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton,
  Container
} from '@mui/material';
import { NotificationsOutlined, PersonOutline } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const pages = ['Home', 'My Events', 'Create Event'];

function Navbar() {
  const location = useLocation();

  const getPagePath = (page: string) => {
    switch (page) {
      case 'Home':
        return '/';
      case 'My Events':
        return '/my-events';
      case 'Create Event':
        return '/create-event';
      default:
        return '/';
    }
  };

  return (
    <AppBar 
      position="static" 
      elevation={1}
      sx={{ 
        backgroundColor: 'white', 
        color: '#333',
        borderRadius: 0,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar 
          disableGutters 
          sx={{ 
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1
          }}
        >
          {/* Left Side - Logo and Navigation */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 4
          }}>
            {/* Brand Logo */}
            <Typography
              variant="h5"
              component={RouterLink}
              to="/"
              sx={{
                fontFamily: 'sans-serif',
                fontWeight: 600,
                color: '#333',
                textDecoration: 'none',
                fontSize: '1.5rem'
              }}
            >
              NearMe
            </Typography>

            {/* Navigation Links */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              gap: 2
            }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  component={RouterLink}
                  to={getPagePath(page)}
                  sx={{ 
                    color: location.pathname === getPagePath(page) ? '#007bff' : '#333',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: location.pathname === getPagePath(page) ? 600 : 400,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#007bff'
                    }
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Right Side Icons */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1
          }}>
            <IconButton
              sx={{ 
                color: '#333',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)'
                }
              }}
            >
              <NotificationsOutlined />
            </IconButton>
            
            <IconButton
              sx={{ 
                color: '#333',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)'
                }
              }}
            >
              <PersonOutline />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
