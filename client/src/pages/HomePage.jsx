import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container home-page">
      <section className="hero">
        <h2>Gerenciador de Metas Pessoais</h2>
        <p className="lead">
          Organize, acompanhe e alcance suas metas pessoais de forma eficiente
        </p>
        
        {!user ? (
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">
              Comece Agora
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Já tenho uma conta
            </Link>
          </div>
        ) : (
          <div className="cta-buttons">
            <Link to="/dashboard" className="btn btn-primary">
              Ir para Dashboard
            </Link>
            <Link to="/goals" className="btn btn-secondary">
              Minhas Metas
            </Link>
          </div>
        )}
      </section>
      
      <section className="features">
        <h3>Recursos Principais</h3>
        <div className="features-grid">
          <div className="feature-item">
            <h4>Organize suas Metas</h4>
            <p>Crie, edite e organize suas metas pessoais de forma simples e intuitiva</p>
          </div>
          <div className="feature-item">
            <h4>Acompanhe seu Progresso</h4>
            <p>Visualize seu progresso e mantenha-se motivado para alcançar seus objetivos</p>
          </div>
          <div className="feature-item">
            <h4>Acesse em Qualquer Lugar</h4>
            <p>Acesse suas metas em qualquer dispositivo, a qualquer momento</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;