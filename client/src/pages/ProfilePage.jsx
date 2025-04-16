import React, { useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GoalContext } from '../context/GoalContext';
import api from '../services/api';

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const { goals } = useContext(GoalContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Carregar dados do usuário no formulário
  useEffect(() => {
    if (user) {
      setFormData(prevState => ({
        ...prevState,
        name: user.name || '',
        username: user.username || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validação das senhas
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('As novas senhas não conferem.');
      setLoading(false);
      return;
    }

    try {
      // Preparar dados para atualização
      const updateData = {
        name: formData.name,
        username: formData.username,
        email: formData.email
      };

      // Adicionar senhas apenas se estiver tentando alterar senha
      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await api.put('/users/profile', updateData);
      
      // Atualizar info local com resposta do servidor
      if (response.data) {
        // Atualizar dados armazenados
        const updatedUser = {...user, ...response.data};
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Limpar campos de senha
        setFormData(prevState => ({
          ...prevState,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        
        setSuccess('Perfil atualizado com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setError('Erro ao atualizar perfil. Verifique suas informações e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      try {
        await api.delete('/users/profile');
        logout(); // Fazer logout após excluir a conta
      } catch (error) {
        console.error('Erro ao excluir conta:', error);
        setError('Erro ao excluir conta. Tente novamente mais tarde.');
      }
    }
  };

  // Estatísticas do usuário
  const completedGoals = goals.filter(goal => goal.completed).length;
  const pendingGoals = goals.length - completedGoals;
  const completionRate = goals.length ? Math.round((completedGoals / goals.length) * 100) : 0;

  return (
    <div className="container profile-page">
      <h2>Meu Perfil</h2>
      
      <div className="profile-stats">
        <h3>Minhas Estatísticas</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Metas Criadas</h4>
            <p className="stat-number">{goals.length}</p>
          </div>
          <div className="stat-card">
            <h4>Metas Concluídas</h4>
            <p className="stat-number">{completedGoals}</p>
          </div>
          <div className="stat-card">
            <h4>Metas Pendentes</h4>
            <p className="stat-number">{pendingGoals}</p>
          </div>
          <div className="stat-card">
            <h4>Taxa de Conclusão</h4>
            <p className="stat-number">{completionRate}%</p>
          </div>
        </div>
      </div>
      
      <div className="profile-form-container">
        <h3>Informações Pessoais</h3>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Nome de usuário</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="name">Nome completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <h4>Alterar Senha</h4>
          
          <div className="form-group">
            <label htmlFor="currentPassword">Senha atual</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">Nova senha</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              minLength={6}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirme a nova senha</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength={6}
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
        
        <div className="danger-zone">
          <h3>Zona de Perigo</h3>
          <p>Ao excluir sua conta, todos os seus dados serão permanentemente removidos.</p>
          <button 
            className="btn btn-danger" 
            onClick={handleDeleteAccount}
          >
            Excluir minha conta
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;