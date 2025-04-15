import React, { useState, useContext } from 'react';
import { GoalContext } from '../../context/GoalContext';

const GoalItem = ({ goal }) => {
  const { removeGoal, updateGoal } = useContext(GoalContext);
  const [showDetails, setShowDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  
  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta meta?')) {
      setIsDeleting(true);
      try {
        await removeGoal(goal._id);
      } catch (error) {
        console.error('Erro ao excluir meta:', error);
        setIsDeleting(false);
      }
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
  
  // Classe condicional baseada na prioridade
  const priorityClass = `priority-${goal.priority ? goal.priority.toLowerCase() : 'media'}`;
  
  return (
    <div className={`goal-item ${goal.completed ? 'completed' : ''}`}>
      <div className="goal-header">
        <div className="goal-title-status">
          <input 
            type="checkbox"
            checked={goal.completed}
            onChange={toggleComplete}
            className="goal-checkbox"
            id={`goal-${goal._id}`}
          />
          <h3 
            className={goal.completed ? 'completed-title' : ''}
            onClick={toggleDetails}
          >
            {goal.title}
          </h3>
        </div>
        
        <div className="goal-actions">
          <button 
            className="btn-details" 
            onClick={toggleDetails}
          >
            {showDetails ? 'Ocultar' : 'Detalhes'}
          </button>
          <button 
            className="btn-delete"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
      
      {showDetails && (
        <div className="goal-details">
          <p className="goal-description">{goal.description}</p>
          <div className="goal-meta">
            <span className={`goal-priority ${priorityClass}`}>
              Prioridade: {goal.priority || 'Média'}
            </span>
            <span className="goal-deadline">
              Data Limite: {formatDate(goal.deadline)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalItem;