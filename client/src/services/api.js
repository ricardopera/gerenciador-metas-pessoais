import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL base da API
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(
  config => {
    // Buscar o token diretamente do localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Função para obter todas as metas
export const getGoals = async () => {
  const response = await api.get('/goals');
  return response.data;
};

// Função para criar uma nova meta
export const createGoal = async (goalData) => {
  const response = await api.post('/goals', goalData);
  return response.data;
};

// Função para atualizar uma meta existente
export const updateGoal = async (goalId, goalData) => {
  const response = await api.put(`/goals/${goalId}`, goalData);
  return response.data;
};

// Função para deletar uma meta
export const deleteGoal = async (goalId) => {
  const response = await api.delete(`/goals/${goalId}`);
  return response.data;
};

// Exportando a instância da API como padrão
export default api;