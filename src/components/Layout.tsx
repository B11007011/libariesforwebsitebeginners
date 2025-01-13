import React, { useState } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Home as HomeIcon,
  Book as JournalIcon,
  Psychology as WellbeingIcon,
  CalendarMonth as CalendarIcon,
  Restaurant as DietIcon,
  Person as ProfileIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';
import { Theme } from '@mui/material/styles';

const DRAWER_WIDTH = 280;

const menuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Journal', icon: <JournalIcon />, path: '/diary' },
  { text: 'Wellbeing', icon: <WellbeingIcon />, path: '/wellbeing' },
  { text: 'Calendar', icon: <CalendarIcon />, path: '/calendar' },
  { text: 'Healthy Diet', icon: <DietIcon />, path: '/diet' }
];

const drawerItemStyles = {
  mx: 1,
  borderRadius: 1.5,
  mb: 0.5,
  '&.Mui-selected': {
    backgroundColor: 'primary.main',
    color: 'white',
    '&:hover': {
      backgroundColor: 'primary.dark',
    },
    '& .MuiListItemIcon-root': {
      color: 'white',
    },
  },
  '&:hover': {
    backgroundColor: 'action.hover',
  },
  transition: 'all 0.2s ease-in-out'
};

const appBarStyles = {
  zIndex: (theme: Theme) => theme.zIndex.drawer + 1,
  color: 'text.primary',
  borderBottom: '1px solid',
  borderColor: 'divider',
  backdropFilter: 'blur(20px)',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
};

const mainContentStyles = {
  flexGrow: 1, 
  p: 3,
  backgroundColor: 'grey.50',
  borderRadius: { xs: 0, sm: 2 },
  m: { xs: 0, sm: 2 },
  boxShadow: { xs: 'none', sm: '0 0 10px rgba(0,0,0,0.05)' }
};

const drawerContentStyles = {
  height: '100%', 
  display: 'flex', 
  flexDirection: 'column',
  backgroundColor: 'background.paper'
};

const profileSectionStyles = {
  p: 2.5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'grey.50'
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const drawer = (
    <Box sx={drawerContentStyles}>
      <Box sx={profileSectionStyles}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40, 
              bgcolor: 'primary.main' 
            }}
          >
            {currentUser?.email?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {currentUser?.email?.split('@')[0] || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentUser?.email}
            </Typography>
          </Box>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      
      <Divider />
      
      <List sx={{ flexGrow: 1, pt: 2, px: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
            selected={location.pathname === item.path}
            sx={drawerItemStyles}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? 'inherit' : 'text.primary',
              minWidth: 40
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: location.pathname === item.path ? 'bold' : 'normal'
              }}
            />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ p: 2.5 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          onClick={handleLogout}
          sx={{ 
            borderRadius: 2,
            py: 1,
            textTransform: 'none',
            fontWeight: 'medium'
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={appBarStyles}
      >
        <Toolbar>
          {currentUser && isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Mindful Moments
          </Typography>
          
          {currentUser ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationBell />
              <Tooltip title="Profile">
                <IconButton 
                  color="inherit" 
                  onClick={() => navigate('/profile')}
                  sx={{ 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2
                  }}
                >
                  <ProfileIcon />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Button 
              variant="contained" 
              onClick={() => navigate('/login')}
              sx={{ borderRadius: 2 }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {currentUser && (
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider'
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        ml: currentUser && !isMobile ? `${DRAWER_WIDTH}px` : 0
      }}>
        <Toolbar />
        <Box 
          component="main" 
          sx={mainContentStyles}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 