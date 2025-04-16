import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

// Criando uma função de navegação que será injetada no login/logout
const createAuthHelpers = (navigate) => ({
    login: async (credentials) => {
        try {
            const response = await api.post('/users/login', credentials);
            const userData = response.data.user;
            const token = userData.token;
            
            // Armazenar o token separadamente
            if (token) {
                localStorage.setItem('authToken', token);
                // Remover o token do objeto de usuário antes de armazenar
                const { token: _, ...userWithoutToken } = userData;
                localStorage.setItem('user', JSON.stringify(userWithoutToken));
            } else {
                localStorage.setItem('user', JSON.stringify(userData));
            }
            
            navigate('/dashboard');
            return userData;
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    },
    
    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        navigate('/');
        return null;
    },
    
    register: async (userData) => {
        try {
            const response = await api.post('/users/register', userData);
            const newUser = response.data.user;
            const token = newUser.token;
            
            // Armazenar o token separadamente
            if (token) {
                localStorage.setItem('authToken', token);
                // Remover o token do objeto de usuário antes de armazenar
                const { token: _, ...userWithoutToken } = newUser;
                localStorage.setItem('user', JSON.stringify(userWithoutToken));
            } else {
                localStorage.setItem('user', JSON.stringify(newUser));
            }
            
            navigate('/dashboard');
            return newUser;
        } catch (error) {
            console.error('Erro ao registrar:', error);
            throw error;
        }
    }
});

// Componente Provider que não usa diretamente o hook de navegação
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authHelpers, setAuthHelpers] = useState(null);

    useEffect(() => {
        // Carregar usuário do localStorage na inicialização
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Função memoizada para evitar recriações desnecessárias e loops infinitos
    const setupAuthHelpers = useCallback((navigateFunction) => {
        const helpers = createAuthHelpers(navigateFunction);
        setAuthHelpers(helpers);
        return helpers;
    }, []);

    // Funções de autenticação que usam os helpers ou configuram eles se necessário
    const login = async (credentials) => {
        const user = await authHelpers.login(credentials);
        setUser(user);
    };

    const logout = () => {
        authHelpers.logout();
        setUser(null);
    };

    const register = async (userData) => {
        const newUser = await authHelpers.register(userData);
        setUser(newUser);
    };

    return (
        <AuthContext.Provider value={{ 
            user,
            login,
            logout,
            register,
            setupAuthHelpers
        }}>
            {children}
        </AuthContext.Provider>
    );
};