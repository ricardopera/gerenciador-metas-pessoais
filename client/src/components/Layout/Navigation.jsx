import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  Box,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Flag as FlagIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const Navigation = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  
  // Determinar a aba ativa com base na rota atual
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path === '/dashboard') return 1;
    if (path === '/goals') return 2;
    if (path === '/profile') return 3;
    return false; // Nenhuma aba selecionada para outras rotas
  };

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        borderRadius: 0, 
        position: 'sticky',
        top: 64, // Altura do header
        zIndex: 1000,
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: user ? 'block' : 'none' // Ocultar quando não há usuário logado
      }}
    >
      <Box 
        sx={{ 
          maxWidth: { xs: '100%', sm: 768, md: 1200 }, 
          mx: 'auto',
          px: 2
        }}
      >
        <Tabs 
          value={getActiveTab()} 
          variant={isMobile ? "fullWidth" : "standard"}
          aria-label="navegação principal" 
          textColor="primary"
          indicatorColor="primary"
          sx={{ 
            minHeight: isMobile ? 56 : 48,
            '& .MuiTab-root': {
              minHeight: isMobile ? 56 : 48,
              fontWeight: 500,
            }
          }}
        >
          <Tab 
            component={NavLink} 
            to="/" 
            icon={isMobile ? <HomeIcon /> : null}
            iconPosition="start"
            label={isMobile ? "" : "Início"} 
            sx={{ 
              minWidth: isMobile ? 0 : 100,
              '&.active': {
                color: theme.palette.primary.main,
              }
            }} 
          />
          
          {user && (
            <>
              <Tab 
                component={NavLink} 
                to="/dashboard" 
                icon={isMobile ? <DashboardIcon /> : null}
                iconPosition="start"
                label={isMobile ? "" : "Dashboard"} 
                sx={{ 
                  minWidth: isMobile ? 0 : 100,
                  '&.active': {
                    color: theme.palette.primary.main,
                  }
                }} 
              />
              
              <Tab 
                component={NavLink} 
                to="/goals" 
                icon={isMobile ? <FlagIcon /> : null}
                iconPosition="start"
                label={isMobile ? "" : "Minhas Metas"} 
                sx={{ 
                  minWidth: isMobile ? 0 : 100,
                  '&.active': {
                    color: theme.palette.primary.main,
                  }
                }} 
              />
              
              <Tab 
                component={NavLink} 
                to="/profile" 
                icon={isMobile ? <PersonIcon /> : null}
                iconPosition="start"
                label={isMobile ? "" : "Perfil"} 
                sx={{ 
                  minWidth: isMobile ? 0 : 100,
                  '&.active': {
                    color: theme.palette.primary.main,
                  }
                }} 
              />
            </>
          )}
        </Tabs>
      </Box>
    </Paper>
  );
};

export default Navigation;