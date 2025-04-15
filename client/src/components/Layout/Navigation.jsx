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
            <NavLink exact to="/" className="nav-link" activeClassName="active">
              Início
            </NavLink>
          </li>
          
          {user ? (
            <>
              <li className="nav-item">
                <NavLink to="/dashboard" className="nav-link" activeClassName="active">
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/goals" className="nav-link" activeClassName="active">
                  Minhas Metas
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/profile" className="nav-link" activeClassName="active">
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