import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navigation = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="main-nav">
      <div className="container">
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Início
            </NavLink>
          </li>
          
          {user ? (
            <>
              <li className="nav-item">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/goals" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  Minhas Metas
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  Perfil
                </NavLink>
              </li>
            </>
          ) : null}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;