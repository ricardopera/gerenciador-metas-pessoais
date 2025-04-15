import React, { useContext, useState } from 'react';
import { GoalContext } from '../../context/GoalContext';
import GoalItem from './GoalItem';

const GoalList = () => {
  const { goals, loading } = useContext(GoalContext);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  if (loading) {
    return <div className="loading">Carregando metas...</div>;
  }

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
          return priorityOrder[a.priority] - priorityOrder[b.priority];
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

  return (
    <div className="goals-list-container">
      <div className="goals-header">
        <h2>Minhas Metas</h2>
        <div className="goals-controls">
          <div className="goals-filter">
            <label htmlFor="filter">Filtrar:</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="active">Pendentes</option>
              <option value="completed">Concluídas</option>
            </select>
          </div>
          
          <div className="goals-sort">
            <label htmlFor="sortBy">Ordenar por:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Mais Recentes</option>
              <option value="deadline">Data Limite</option>
              <option value="priority">Prioridade</option>
              <option value="alpha">Alfabética</option>
            </select>
          </div>
        </div>
      </div>

      {filteredGoals.length === 0 ? (
        <div className="no-goals-message">
          <p>Você ainda não tem metas {filter !== 'all' ? 'nesta categoria' : 'cadastradas'}.</p>
        </div>
      ) : (
        <div className="goals-grid">
          {filteredGoals.map(goal => (
            <GoalItem key={goal._id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalList;