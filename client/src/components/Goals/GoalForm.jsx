import React, { useState, useContext } from 'react';
import { GoalContext } from '../../context/GoalContext';

const GoalForm = ({ editGoal = null }) => {
  const { addGoal, updateGoal } = useContext(GoalContext);
  const [formData, setFormData] = useState({
    title: editGoal?.title || '',
    description: editGoal?.description || '',
    deadline: editGoal?.deadline ? new Date(editGoal.deadline).toISOString().substr(0, 10) : '',
    priority: editGoal?.priority || 'Média'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Criar um objeto com os dados do formulário para enviar
      const goalData = {
        ...formData,
        // Se deadline estiver vazio, enviamos null, caso contrário enviamos o objeto Date
        deadline: formData.deadline ? new Date(formData.deadline) : null
      };

      if (editGoal) {
        await updateGoal(editGoal._id, goalData);
        setSuccess('Meta atualizada com sucesso!');
      } else {
        await addGoal(goalData);
        setFormData({
          title: '',
          description: '',
          deadline: '',
          priority: 'Média'
        });
        setSuccess('Meta criada com sucesso!');
      }
    } catch (err) {
      setError('Ocorreu um erro ao salvar a meta. Tente novamente.');
      console.error('Erro ao salvar meta:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="goal-form-container">
      <h3>{editGoal ? 'Editar Meta' : 'Nova Meta'}</h3>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form className="goal-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Digite o título da meta"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Descreva sua meta"
            rows="4"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="deadline">Data limite</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="priority">Prioridade</label>
            <select 
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Salvando...' : (editGoal ? 'Atualizar' : 'Criar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalForm;