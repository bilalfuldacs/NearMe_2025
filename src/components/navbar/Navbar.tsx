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
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton
} from '@mui/material';
import {
  Home,
  EventNote,
  Add,
  Notifications,
  Message,
  AccountCircle,
  Logout,
  Person,
  Menu as MenuIcon
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
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
        {/* Left Side - Mobile Menu + Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Mobile Menu Button */}
          <IconButton
            onClick={handleMobileMenuToggle}
            sx={{
              display: { xs: 'block', md: 'none' },
              color: '#666',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>

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
        </Box>

        {/* Desktop Navigation Links */}
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

    {/* Mobile Navigation Drawer */}
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={handleMobileMenuClose}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: 280,
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e0e0e0'
        }
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
          Navigation
        </Typography>
      </Box>
      
      <List sx={{ pt: 2 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              onClick={handleMobileMenuClose}
              sx={{
                py: 1.5,
                px: 3,
                backgroundColor: isActive(item.path) ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive(item.path) 
                    ? 'rgba(25, 118, 210, 0.12)' 
                    : 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? '#1976d2' : '#666' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  color: isActive(item.path) ? '#1976d2' : '#333',
                  fontWeight: isActive(item.path) ? 600 : 400
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Mobile Profile Section */}
      <Box sx={{ px: 3, py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: '#1976d2',
              fontSize: '1rem'
            }}
          >
            {getInitials(user?.name || user?.username || user?.email || 'User')}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user?.username || user?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<AccountCircle />}
          onClick={() => {
            handleMobileMenuClose();
            navigate('/profile');
          }}
          sx={{
            mb: 1,
            textTransform: 'none',
            borderColor: '#e0e0e0',
            color: '#666',
            '&:hover': {
              borderColor: '#1976d2',
              color: '#1976d2'
            }
          }}
        >
          My Profile
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<Logout />}
          onClick={() => {
            handleLogout();
            handleMobileMenuClose();
          }}
          sx={{
            textTransform: 'none',
            borderColor: '#e0e0e0',
            color: '#666',
            '&:hover': {
              borderColor: '#d32f2f',
              color: '#d32f2f'
            }
          }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
</AppBar>
  );
};

export default Navbar;