import React, { useState, useContext } from 'react';
import { GoalContext } from '../../context/GoalContext';
import { 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Checkbox, 
  Box, 
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Divider,
  useTheme
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AccessTime as AccessTimeIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const GoalItem = ({ goal }) => {
  const { removeGoal, updateGoal } = useContext(GoalContext);
  const [showDetails, setShowDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  
  const handleDeleteClick = () => {
    setDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  
  const handleDelete = async () => {
    setDialogOpen(false);
    setIsDeleting(true);
    try {
      await removeGoal(goal._id);
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
      setIsDeleting(false);
    }
  };
  
  const toggleComplete = async () => {
    try {
      await updateGoal(goal._id, { completed: !goal.completed });
    } catch (error) {
      console.error('Erro ao atualizar status da meta:', error);
    }
  };
  
  // Formatar a data limite
  const formatDate = (dateString) => {
    if (!dateString) return 'Sem prazo definido';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };
  
  // Determinar cores baseadas na prioridade
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'alta':
        return { color: '#f44336', bgColor: '#ffebee' };
      case 'baixa':
        return { color: '#4caf50', bgColor: '#e8f5e9' };
      case 'média':
      default:
        return { color: '#ff9800', bgColor: '#fff3e0' };
    }
  };
  
  const priorityColors = getPriorityColor(goal.priority);
  
  // Verificar se o prazo está próximo
  const isDeadlineClose = () => {
    if (!goal.deadline) return false;
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };
  
  // Verificar se o prazo já passou
  const isDeadlinePassed = () => {
    if (!goal.deadline) return false;
    const today = new Date();
    const deadline = new Date(goal.deadline);
    return deadline < today && !goal.completed;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <Card 
        sx={{ 
          mb: 2, 
          borderLeft: `4px solid ${priorityColors.color}`,
          opacity: goal.completed ? 0.8 : 1,
          backgroundColor: goal.completed ? '#f5f5f5' : 'white',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)'
          }
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexGrow: 1 }}>
              <Checkbox 
                checked={goal.completed}
                onChange={toggleComplete}
                color="primary"
                sx={{ 
                  mt: -0.5, 
                  mr: 1,
                  color: theme.palette.primary.main,
                  '&.Mui-checked': {
                    color: theme.palette.primary.main,
                  }
                }}
              />
              <Box>
                <Typography 
                  variant="h6" 
                  component="h3"
                  sx={{ 
                    textDecoration: goal.completed ? 'line-through' : 'none',
                    color: goal.completed ? 'text.secondary' : 'text.primary',
                    cursor: 'pointer',
                    fontWeight: 500,
                    mb: 0.5
                  }}
                  onClick={toggleDetails}
                >
                  {goal.title}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  <Chip
                    icon={<FlagIcon sx={{ fontSize: '1rem !important' }} />}
                    label={goal.priority || 'Média'}
                    size="small"
                    sx={{
                      backgroundColor: priorityColors.bgColor,
                      color: priorityColors.color,
                      fontWeight: 500,
                      fontSize: '0.75rem'
                    }}
                  />
                  
                  <Chip
                    icon={<AccessTimeIcon sx={{ fontSize: '1rem !important' }} />}
                    label={formatDate(goal.deadline)}
                    size="small"
                    sx={{
                      backgroundColor: isDeadlinePassed() ? '#ffebee' : 
                                       isDeadlineClose() ? '#fff3e0' : '#f5f5f5',
                      color: isDeadlinePassed() ? '#d32f2f' : 
                             isDeadlineClose() ? '#e65100' : 'text.secondary',
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex' }}>
              <IconButton
                size="small"
                onClick={toggleDetails}
                aria-expanded={showDetails}
                aria-label="mostrar detalhes"
              >
                {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
              <IconButton 
                size="small"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                color="error"
                aria-label="excluir meta"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
          
          <Collapse in={showDetails}>
            <Box sx={{ mt: 2, pl: 4 }}>
              <Divider sx={{ mb: 1.5 }} />
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {goal.description || 'Sem descrição'}
              </Typography>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
      
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmar exclusão
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir a meta "{goal.title}"? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Cancelar</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default GoalItem;