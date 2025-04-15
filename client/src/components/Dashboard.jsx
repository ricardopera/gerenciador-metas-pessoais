import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoalContext } from '../context/GoalContext';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { goals, loading } = useContext(GoalContext);
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0
  });

  useEffect(() => {
    if (goals.length > 0) {
      const completed = goals.filter(goal => goal.completed).length;
      
      setStats({
        total: goals.length,
        completed: completed,
        inProgress: goals.length - completed,
        notStarted: 0 // Ajuste conforme seu modelo de dados
      });
    }
  }, [goals]);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="container dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p>Bem-vindo(a), {user?.username || user?.name || 'Usuário'}!</p>
      </div>

      <div className="stats-container">
        <div className="stat-card total">
          <h3>Total de Metas</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card completed">
          <h3>Concluídas</h3>
          <p className="stat-number">{stats.completed}</p>
        </div>
        <div className="stat-card in-progress">
          <h3>Em Andamento</h3>
          <p className="stat-number">{stats.inProgress}</p>
        </div>
      </div>

      <div className="recent-goals">
        <div className="section-header">
          <h3>Metas Recentes</h3>
          <Link to="/goals" className="btn btn-sm">Ver Todas</Link>
        </div>
        
        {goals.length === 0 ? (
          <p className="no-goals">Você ainda não tem metas cadastradas.</p>
        ) : (
          <ul className="goals-list">
            {goals.slice(0, 3).map(goal => (
              <li key={goal._id} className={`goal-item ${goal.completed ? 'completed' : ''}`}>
                <h4>{goal.title}</h4>
                <p>{goal.description.substring(0, 100)}...</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="dashboard-actions">
        <Link to="/goals" className="btn btn-primary">
          Gerenciar Metas
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;