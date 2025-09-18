import React from 'react';
import Navigation from './Navigation';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navigation />
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <p>&copy; 2025 <span className="iceland-regular">0Viewers</span> - Donnez une chance aux petits streamers ❤️</p>
      </footer>
    </div>
  );
};

export default Layout;