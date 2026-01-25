import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, LogIn, LogOut, Loader } from 'lucide-react';

const Login = () => {
  const { isAuthenticated, user, loading, login, logout } = useAuth();
  const [showAuthInfo, setShowAuthInfo] = useState(false);

  useEffect(() => {
    // Show auth info after a brief delay to allow for token exchange
    if (!loading) {
      const timer = setTimeout(() => {
        setShowAuthInfo(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card loading">
          <Loader className="loading-spinner" size={32} />
          <p>Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-icon">
            <User size={48} />
          </div>
          <h2>Welcome</h2>
          <p>Please sign in to access the financial dashboard</p>
          <button className="auth-button" onClick={login}>
            <LogIn size={20} />
            Sign In with Cognito
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card authenticated">
        <div className="user-info">
          <div className="user-avatar">
            <User size={32} />
          </div>
          <div className="user-details">
            <h3>{user.name}</h3>
            <p className="user-email">{user.email}</p>
            <p className="user-id">ID: {user.sub}</p>
          </div>
        </div>
        <div className="auth-actions">
          <button className="auth-button logout" onClick={logout}>
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;