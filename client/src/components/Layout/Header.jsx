import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="header">
      <div className="container header-content">
        <h1 className="logo">
          <Link to="/">Metas Pessoais</Link>
        </h1>
        <div className="user-area">
          {user ? (
            <div className="user-info">
              <span>Olá, {user.username || user.name}</span>
              <button className="btn-logout" onClick={logout}>Sair</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-login">Login</Link>
              <Link to="/register" className="btn btn-register">Registrar</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;