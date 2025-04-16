import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Grid,
  Card, 
  CardContent,
  Link,
  useTheme,
  useMediaQuery,
  Paper,
  Divider
} from '@mui/material';
import { 
  CheckCircleOutline as CheckIcon,
  TrendingUp as ProgressIcon,
  DevicesOutlined as DevicesIcon,
  Flag as FlagIcon,
  ArrowForward as ArrowIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description, delay }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card 
        elevation={2}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 20px -10px rgba(0,0,0,0.2)',
          },
          borderRadius: 2
        }}
      >
        <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
          <Box 
            sx={{ 
              mb: 2, 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '70px'
            }}
          >
            {icon}
          </Box>
          <Typography 
            variant="h5" 
            component="h3" 
            gutterBottom
            sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}
          >
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          pt: { xs: 8, sm: 12, md: 16 }, 
          pb: { xs: 8, sm: 12, md: 16 },
          bgcolor: 'primary.main',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 0
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 120%, rgba(33, 150, 243, 0.9) 0%, rgba(25, 118, 210, 0.9) 100%)',
            zIndex: 1
          }}
        />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <FlagIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography 
                variant="h2" 
                component="h1"
                gutterBottom
                sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                Gerenciador de Metas Pessoais
              </Typography>
              
              <Typography 
                variant="h5" 
                component="p"
                sx={{ 
                  mb: 5, 
                  maxWidth: '800px', 
                  mx: 'auto', 
                  opacity: 0.9,
                  fontSize: { xs: '1.1rem', md: '1.3rem' }
                }}
              >
                Organize, acompanhe e alcance seus objetivos com eficiência.
                Uma maneira simples de transformar seus sonhos em realidade.
              </Typography>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {!user ? (
                  <Box sx={{ mt: 4 }}>
                    <Button 
                      component={RouterLink} 
                      to="/register" 
                      size="large"
                      variant="contained"
                      color="secondary"
                      sx={{ 
                        px: 4, 
                        py: 1.5,
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        mr: { xs: 0, sm: 2 },
                        mb: { xs: 2, sm: 0 }
                      }}
                      endIcon={<ArrowIcon />}
                    >
                      Comece Agora
                    </Button>
                    <Button 
                      component={RouterLink} 
                      to="/login" 
                      size="large"
                      variant="outlined"
                      sx={{ 
                        px: 4, 
                        py: 1.5,
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        color: 'white',
                        borderColor: 'white',
                        '&:hover': {
                          borderColor: 'rgba(255,255,255,0.8)',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        }
                      }}
                      endIcon={<LoginIcon />}
                    >
                      Já tenho uma conta
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ mt: 4 }}>
                    <Button 
                      component={RouterLink} 
                      to="/goals" 
                      size="large"
                      variant="contained"
                      color="secondary"
                      sx={{ 
                        px: 4, 
                        py: 1.5,
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        mr: { xs: 0, sm: 2 },
                        mb: { xs: 2, sm: 0 }
                      }}
                      endIcon={<ArrowIcon />}
                    >
                      Minhas Metas
                    </Button>
                    <Button 
                      component={RouterLink} 
                      to="/dashboard" 
                      size="large"
                      variant="outlined"
                      sx={{ 
                        px: 4, 
                        py: 1.5,
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        color: 'white',
                        borderColor: 'white',
                        '&:hover': {
                          borderColor: 'rgba(255,255,255,0.8)',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        }
                      }}
                    >
                      Dashboard
                    </Button>
                  </Box>
                )}
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: 'text.primary' 
            }}
          >
            Recursos Principais
          </Typography>
          <Typography 
            variant="h6"
            component="p"
            sx={{ 
              maxWidth: '800px',
              mx: 'auto',
              color: 'text.secondary'
            }}
          >
            Tudo o que você precisa para gerenciar suas metas com eficiência
          </Typography>
          <Divider sx={{ width: '80px', mx: 'auto', mt: 3, borderWidth: 2, borderColor: theme.palette.secondary.main }} />
        </Box>

        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <FeatureCard 
              icon={<CheckIcon sx={{ fontSize: 60, color: theme.palette.secondary.main }} />}
              title="Organize suas Metas"
              description="Crie, edite e organize suas metas pessoais com um sistema intuitivo e fácil de usar, mantendo tudo organizado em um só lugar."
              delay={0.1}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard 
              icon={<ProgressIcon sx={{ fontSize: 60, color: theme.palette.secondary.main }} />}
              title="Acompanhe seu Progresso"
              description="Visualize seu progresso com clareza, estabeleça prazos e prioridades para manter o foco no que é mais importante para você."
              delay={0.3}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard 
              icon={<DevicesIcon sx={{ fontSize: 60, color: theme.palette.secondary.main }} />}
              title="Acesse em Qualquer Lugar"
              description="Acesse suas metas em qualquer dispositivo, a qualquer momento. Mantenha-se conectado com seus objetivos, onde quer que esteja."
              delay={0.5}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Button 
                component={RouterLink} 
                to="/register" 
                size="large"
                variant="contained"
                color="primary"
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}
                endIcon={<ArrowIcon />}
              >
                Comece sua jornada agora
              </Button>
            </motion.div>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;