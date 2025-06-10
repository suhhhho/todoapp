import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);

  return (
    <header className="app-header">
      <div className="logo">
        <Link to="/">Todo List App</Link>
      </div>
      <nav className="main-nav">
        {isAuthenticated() ? (
          <>
            <span className="user-greeting">Hello, {user}</span>
            <button onClick={logout} className="btn btn-logout">Logout</button>
          </>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="btn btn-login">Login</Link>
            <Link to="/register" className="btn btn-register">Register</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;