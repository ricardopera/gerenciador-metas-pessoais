import React, { createContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (credentials) => {
        try {
            const response = await api.post('/users/login', credentials);
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            history.push('/dashboard');
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        history.push('/');
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/users/register', userData);
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            history.push('/dashboard');
        } catch (error) {
            console.error('Erro ao registrar:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};