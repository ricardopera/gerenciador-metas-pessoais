import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import HomePage from './pages/HomePage';
import GoalsPage from './pages/GoalsPage';
import ProfilePage from './pages/ProfilePage';
import Dashboard from './components/Dashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Componente auxiliar para rotas protegidas
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { setupAuthHelpers } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Configura os helpers de autenticação com a função navigate
  useEffect(() => {
    setupAuthHelpers(navigate);
  }, [setupAuthHelpers, navigate]);

  return (
    <>
      <Header />
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/goals" 
          element={
            <ProtectedRoute>
              <GoalsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
};

export default AppRoutes;