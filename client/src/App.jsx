import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { GoalProvider } from './context/GoalContext';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './AppRoutes';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <GoalProvider>
                    <AppRoutes />
                </GoalProvider>
            </AuthProvider>
        </Router>
    );
};

export default App;