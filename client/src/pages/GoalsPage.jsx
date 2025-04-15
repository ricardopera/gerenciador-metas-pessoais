import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import GoalForm from '../components/Goals/GoalForm';
import GoalList from '../components/Goals/GoalList';

const GoalsPage = () => {
  const { user } = useContext(AuthContext);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Redirecionar para login se o usuário não estiver autenticado
  if (!user) {
    return <Redirect to="/login" />;
  }

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div className="container goals-page">
      <div className="goals-page-header">
        <h2>Gerenciamento de Metas</h2>
        <button 
          className={`btn ${isFormVisible ? 'btn-secondary' : 'btn-primary'}`} 
          onClick={toggleForm}
        >
          {isFormVisible ? 'Cancelar' : 'Nova Meta'}
        </button>
      </div>

      {isFormVisible && (
        <div className="new-goal-section">
          <GoalForm />
        </div>
      )}

      <div className="goals-section">
        <GoalList />
      </div>
    </div>
  );
};

export default GoalsPage;