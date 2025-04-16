import React, { useState, useContext } from 'react';
import { GoalContext } from '../../context/GoalContext';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Grid,
  Alert,
  Snackbar,
  useTheme,
  FormHelperText,
  IconButton
} from '@mui/material';
import {
  Save as SaveIcon,
  PriorityHigh as PriorityIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { motion } from 'framer-motion';
import { ptBR } from 'date-fns/locale';

const GoalForm = ({ editGoal = null, onCancel }) => {
  const { addGoal, updateGoal } = useContext(GoalContext);
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    title: editGoal?.title || '',
    description: editGoal?.description || '',
    deadline: editGoal?.deadline ? new Date(editGoal.deadline) : null,
    priority: editGoal?.priority || 'Média'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleDateChange = (newDate) => {
    setFormData({
      ...formData,
      deadline: newDate
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Verificar se o título está preenchido
      if (!formData.title.trim()) {
        setError('O título é obrigatório');
        setLoading(false);
        return;
      }

      const goalData = {
        ...formData,
        deadline: formData.deadline
      };

      if (editGoal) {
        await updateGoal(editGoal._id, goalData);
        setSuccess('Meta atualizada com sucesso!');
      } else {
        await addGoal(goalData);
        // Resetar o formulário apenas para nova meta
        setFormData({
          title: '',
          description: '',
          deadline: null,
          priority: 'Média'
        });
        setSuccess('Meta criada com sucesso!');
      }
      
      setOpenSnackbar(true);
      
      // Se tem função de cancelar, chama para fechar o formulário após salvar
      if (onCancel && editGoal) {
        setTimeout(() => {
          onCancel();
        }, 1500);
      }
    } catch (err) {
      setError('Ocorreu um erro ao salvar a meta. Tente novamente.');
      console.error('Erro ao salvar meta:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Paper 
        elevation={3} 
        component="form"
        onSubmit={handleSubmit}
        sx={{ 
          p: 3, 
          mb: 4, 
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2
        }}
      >
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography 
            variant="h5" 
            component="h2" 
            color="primary"
            sx={{ 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {editGoal ? (
              <SaveIcon sx={{ mr: 1 }} />
            ) : (
              <AddIcon sx={{ mr: 1 }} />
            )}
            {editGoal ? 'Editar Meta' : 'Nova Meta'}
          </Typography>
          
          {onCancel && (
            <IconButton 
              color="default" 
              onClick={onCancel}
              aria-label="cancelar"
              size="small"
            >
              <CancelIcon />
            </IconButton>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Título"
              name="title"
              value={formData.title}
              onChange={handleChange}
              variant="outlined"
              placeholder="O que você deseja alcançar?"
              InputProps={{
                autoComplete: 'off'
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrição"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              variant="outlined"
              placeholder="Descreva os detalhes da sua meta..."
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data limite"
                value={formData.deadline}
                onChange={handleDateChange}
                inputFormat="dd/MM/yyyy"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="outlined"
                  />
                )}
              />
            </LocalizationProvider>
            <FormHelperText>Opcional: defina um prazo para concluir</FormHelperText>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="priority-label">Prioridade</InputLabel>
              <Select
                labelId="priority-label"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                label="Prioridade"
                startAdornment={
                  <PriorityIcon 
                    sx={{ 
                      mr: 1, 
                      color: formData.priority === 'Alta' ? '#f44336' : 
                             formData.priority === 'Baixa' ? '#4caf50' : '#ff9800'
                    }} 
                  />
                }
              >
                <MenuItem value="Alta">Alta</MenuItem>
                <MenuItem value="Média">Média</MenuItem>
                <MenuItem value="Baixa">Baixa</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              {onCancel && !editGoal && (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={onCancel}
                  sx={{ mr: 1 }}
                >
                  Cancelar
                </Button>
              )}
              <Button
                variant="contained"
                color={editGoal ? "secondary" : "primary"}
                type="submit"
                disabled={loading}
                startIcon={editGoal ? <SaveIcon /> : <AddIcon />}
              >
                {loading ? 'Salvando...' : (editGoal ? 'Atualizar Meta' : 'Criar Meta')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
          {success}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default GoalForm;