import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  Badge
} from '@mui/material';
import {
  Home,
  EventNote,
  Add,
  Notifications,
  Message,
  AccountCircle,
  Logout,
  Person
} from '@mui/icons-material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AuthContext } from '../../auth/authContext';
import { AppDispatch } from '../../store/store';
import { setEvents } from '../../store/eventsSlice';
import { getInitials } from '../../utils';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const logout = authContext?.logout;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isNotificationOpen = Boolean(notificationAnchor);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    if (logout) {
      logout();
      dispatch(setEvents([]));
      navigate('/login');
    }
    handleMenuClose();
  };

  const navigationItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'My Events', path: '/my-events', icon: <EventNote /> },
    { label: 'Create Event', path: '/create-event', icon: <Add /> },
    { label: 'Messages', path: '/messages', icon: <Message /> }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        backdropFilter: 'blur(10px)',
        zIndex: 1100
      }}
    >
      <Toolbar 
        sx={{ 
          maxWidth: '1200px',
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          justifyContent: 'space-between'
        }}
      >
        {/* Logo */}
        <Typography
          variant="h5"
          component={RouterLink}
          to="/"
          sx={{
            fontWeight: 700,
            color: '#1976d2',
            textDecoration: 'none',
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            '&:hover': {
              color: '#1565c0'
            }
          }}
        >
          NearMe
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              component={RouterLink}
              to={item.path}
              startIcon={item.icon}
              sx={{
                color: isActive(item.path) ? '#1976d2' : '#666',
                textTransform: 'none',
                fontWeight: isActive(item.path) ? 600 : 400,
                px: 2,
                py: 1,
                borderRadius: 2,
                backgroundColor: isActive(item.path) ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive(item.path) 
                    ? 'rgba(25, 118, 210, 0.12)' 
                    : 'rgba(0, 0, 0, 0.04)',
                  color: '#1976d2'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <IconButton
            onClick={handleNotificationMenuOpen}
            sx={{
              color: '#666',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <Badge badgeContent={0} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Profile Menu */}
          <IconButton
            onClick={handleProfileMenuOpen}
            sx={{
              p: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: '#1976d2',
                fontSize: '0.875rem'
              }}
            >
              {getInitials(user?.name || user?.username || user?.email || 'User')}
            </Avatar>
          </IconButton>

          {/* Profile Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1.5,
                  borderRadius: 1
                }
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem disabled>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={user?.username || user?.name || 'User'}
                secondary={user?.email}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
                secondaryTypographyProps={{
                  fontSize: '0.75rem',
                  color: '#666'
                }}
              />
            </MenuItem>
            <Divider />
            <MenuItem 
              onClick={() => {
                handleMenuClose();
                navigate('/profile');
              }}
            >
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText>My Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>

          {/* Notifications Dropdown Menu */}
          <Menu
            anchorEl={notificationAnchor}
            open={isNotificationOpen}
            onClose={handleNotificationMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 280,
                borderRadius: 2,
                border: '1px solid #e0e0e0'
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem disabled>
              <ListItemText 
                primary="Notifications"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              />
            </MenuItem>
            <Divider />
            <MenuItem disabled>
              <ListItemText 
                primary="No new notifications"
                primaryTypographyProps={{
                  fontSize: '0.75rem',
                  color: '#666',
                  textAlign: 'center'
                }}
              />
            </MenuItem>
          </Menu>
        </Box>
    </Toolbar>
</AppBar>
  );
};

export default Navbar;