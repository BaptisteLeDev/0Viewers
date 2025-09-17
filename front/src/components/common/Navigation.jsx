import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to={ROUTES.HOME} className="nav-logo">
          <span className="logo-text">0Viewers</span>
          <span className="logo-subtitle">Découvrez les streamers oubliés</span>
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link 
              to={ROUTES.HOME} 
              className={`nav-link ${isActive(ROUTES.HOME) ? 'active' : ''}`}
            >
              🏠 Accueil
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to={ROUTES.STREAMERS} 
              className={`nav-link ${isActive(ROUTES.STREAMERS) ? 'active' : ''}`}
            >
              🎮 Streamers
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to={ROUTES.ACCOUNT} 
              className={`nav-link ${isActive(ROUTES.ACCOUNT) ? 'active' : ''}`}
            >
              👤 Mon Compte
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;