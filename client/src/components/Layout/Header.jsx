import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Avatar,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  AccountCircle, 
  Dashboard, 
  Logout, 
  Person, 
  Menu as MenuIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleDashboardClick = () => {
    handleMenuClose();
    navigate('/goals');
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem onClick={handleProfileClick}>
        <Person sx={{ mr: 1 }} fontSize="small" /> Perfil
      </MenuItem>
      <MenuItem onClick={handleDashboardClick}>
        <Dashboard sx={{ mr: 1 }} fontSize="small" /> Dashboard
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <Logout sx={{ mr: 1 }} fontSize="small" /> Sair
      </MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchorEl}
      open={Boolean(mobileMenuAnchorEl)}
      onClose={handleMenuClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {user ? (
        <>
          <MenuItem onClick={handleProfileClick}>
            <Person sx={{ mr: 1 }} fontSize="small" /> Perfil
          </MenuItem>
          <MenuItem onClick={handleDashboardClick}>
            <Dashboard sx={{ mr: 1 }} fontSize="small" /> Dashboard
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 1 }} fontSize="small" /> Sair
          </MenuItem>
        </>
      ) : (
        <>
          <MenuItem onClick={() => { handleMenuClose(); navigate('/login'); }}>
            Login
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); navigate('/register'); }}>
            Registrar
          </MenuItem>
        </>
      )}
    </Menu>
  );

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AppBar position="static" elevation={2} sx={{ backgroundColor: 'primary.main' }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', p: { xs: 0.5, sm: 1 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FlagIcon sx={{ mr: 1, fontSize: 30 }} />
              <Typography 
                variant="h6" 
                component={Link} 
                to="/"
                sx={{
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Metas Pessoais
              </Typography>
            </Box>

            {isMobile ? (
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenuOpen}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {user ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                      Olá, {user.username || user.name}
                    </Typography>
                    <IconButton
                      size="large"
                      edge="end"
                      aria-label="conta do usuário atual"
                      aria-haspopup="true"
                      onClick={handleProfileMenuOpen}
                      color="inherit"
                    >
                      <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}>
                        {(user.username || user.name || '?')[0].toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Box>
                ) : (
                  <Box>
                    <Button 
                      component={Link} 
                      to="/login" 
                      color="inherit" 
                      sx={{ mr: 1 }}
                    >
                      Login
                    </Button>
                    <Button 
                      component={Link} 
                      to="/register" 
                      variant="contained" 
                      color="secondary"
                    >
                      Registrar
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      {renderMenu}
      {renderMobileMenu}
    </motion.div>
  );
};

export default Header;