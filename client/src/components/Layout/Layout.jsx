import React from 'react';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import Header from './Header';
import Navigation from './Navigation';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      <Header />
      <Navigation />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          width: '100%',
          pb: 6
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </Box>
      
      <Box 
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: theme.palette.grey[100],
          borderTop: `1px solid ${theme.palette.divider}`
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            textAlign: 'center',
            color: theme.palette.text.secondary,
            fontSize: '0.875rem'
          }}>
            © {new Date().getFullYear()} Gerenciador de Metas Pessoais. Todos os direitos reservados.
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;