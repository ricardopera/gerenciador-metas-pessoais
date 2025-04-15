import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const GoalContext = createContext();

export const GoalProvider = ({ children }) => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        // Busca as metas apenas se o usuário estiver autenticado
        if (user) {
            fetchGoals();
        } else {
            setGoals([]);
            setLoading(false);
        }
    }, [user]);

    const fetchGoals = async () => {
        try {
            setLoading(true);
            const response = await api.get('/goals');
            setGoals(response.data);
            setError(null);
        } catch (error) {
            console.error('Erro ao buscar metas:', error);
            setError('Não foi possível carregar suas metas. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    const addGoal = async (goalData) => {
        try {
            setLoading(true);
            const response = await api.post('/goals', goalData);
            setGoals((prevGoals) => [...prevGoals, response.data]);
            return { success: true, goal: response.data };
        } catch (error) {
            console.error('Erro ao adicionar meta:', error);
            setError('Não foi possível adicionar a meta. Tente novamente.');
            return { success: false, message: error.response?.data?.message || 'Erro desconhecido' };
        } finally {
            setLoading(false);
        }
    };

    const removeGoal = async (id) => {
        try {
            setLoading(true);
            await api.delete(`/goals/${id}`);
            setGoals((prevGoals) => prevGoals.filter((goal) => goal._id !== id));
            return { success: true };
        } catch (error) {
            console.error('Erro ao remover meta:', error);
            setError('Não foi possível remover a meta. Tente novamente.');
            return { success: false, message: error.response?.data?.message || 'Erro desconhecido' };
        } finally {
            setLoading(false);
        }
    };

    const updateGoal = async (id, goalData) => {
        try {
            setLoading(true);
            const response = await api.put(`/goals/${id}`, goalData);
            setGoals((prevGoals) => 
                prevGoals.map((goal) => 
                    goal._id === id ? response.data : goal
                )
            );
            return { success: true, goal: response.data };
        } catch (error) {
            console.error('Erro ao atualizar meta:', error);
            setError('Não foi possível atualizar a meta. Tente novamente.');
            return { success: false, message: error.response?.data?.message || 'Erro desconhecido' };
        } finally {
            setLoading(false);
        }
    };

    return (
        <GoalContext.Provider value={{ 
            goals, 
            loading, 
            error,
            fetchGoals,
            addGoal, 
            removeGoal,
            updateGoal
        }}>
            {children}
        </GoalContext.Provider>
    );
};