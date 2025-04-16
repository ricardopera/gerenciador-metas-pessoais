import React, { useContext, useState } from 'react';
import { GoalContext } from '../../context/GoalContext';
import GoalItem from './GoalItem';
import {
  Box,
  Typography,
  Container,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Paper,
  Skeleton,
  Divider,
  Fade,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import {
  Sort as SortIcon,
  FilterList as FilterIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const GoalList = () => {
  const { goals, loading } = useContext(GoalContext);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Função para filtrar as metas
  const getFilteredGoals = () => {
    let filteredGoals = [...goals];

    // Aplicar filtro
    switch (filter) {
      case 'completed':
        filteredGoals = filteredGoals.filter(goal => goal.completed);
        break;
      case 'active':
        filteredGoals = filteredGoals.filter(goal => !goal.completed);
        break;
      default:
        // Nenhum filtro aplicado
        break;
    }

    // Aplicar ordenação
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { 'Alta': 1, 'Média': 2, 'Baixa': 3 };
        filteredGoals.sort((a, b) => {
          const aPriority = a.priority || 'Média';
          const bPriority = b.priority || 'Média';
          return priorityOrder[aPriority] - priorityOrder[bPriority];
        });
        break;
      case 'deadline':
        filteredGoals.sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        });
        break;
      case 'alpha':
        filteredGoals.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Ordenar por data de criação (mais recente primeiro)
        filteredGoals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return filteredGoals;
  };

  const filteredGoals = getFilteredGoals();

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Loader skeleton quando estiver carregando
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 2 }}>
          <Skeleton variant="rectangular" width="60%" height={40} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Skeleton variant="rectangular" width="40%" height={56} />
            <Skeleton variant="rectangular" width="40%" height={56} />
          </Box>
        </Box>
        {[1, 2, 3].map((item) => (
          <Skeleton 
            key={item} 
            variant="rectangular" 
            height={100} 
            sx={{ mb: 2, borderRadius: 1 }} 
          />
        ))}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            mb: 3,
            mt: 4
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            color="primary"
            sx={{ 
              mb: isMobile ? 2 : 0,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <TrophyIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
            Minhas Metas
          </Typography>
          
          <Grid container spacing={2} sx={{ maxWidth: isMobile ? '100%' : '60%' }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel id="filter-label">
                  <FilterIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                  Filtrar
                </InputLabel>
                <Select
                  labelId="filter-label"
                  value={filter}
                  onChange={handleFilterChange}
                  label="Filtrar"
                >
                  <MenuItem value="all">Todas</MenuItem>
                  <MenuItem value="active">Pendentes</MenuItem>
                  <MenuItem value="completed">Concluídas</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel id="sort-label">
                  <SortIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                  Ordenar
                </InputLabel>
                <Select
                  labelId="sort-label"
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Ordenar"
                >
                  <MenuItem value="recent">Mais Recentes</MenuItem>
                  <MenuItem value="deadline">Data Limite</MenuItem>
                  <MenuItem value="priority">Prioridade</MenuItem>
                  <MenuItem value="alpha">Alfabética</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <AnimatePresence>
          {filteredGoals.length === 0 ? (
            <Fade in={true}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  borderRadius: 2,
                  bgcolor: 'background.default' 
                }}
              >
                <Alert 
                  severity="info" 
                  variant="outlined"
                  sx={{ 
                    justifyContent: 'center',
                    fontSize: '1rem'
                  }}
                >
                  Você ainda não tem metas {filter !== 'all' ? 'nesta categoria' : 'cadastradas'}.
                </Alert>
              </Paper>
            </Fade>
          ) : (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Box>
                {filteredGoals.map(goal => (
                  <GoalItem key={goal._id} goal={goal} />
                ))}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Container>
  );
};

export default GoalList;