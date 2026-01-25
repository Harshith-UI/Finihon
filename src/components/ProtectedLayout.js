import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader, LogIn, Shield } from 'lucide-react';

const ProtectedLayout = ({ children }) => {
  const { isAuthenticated, loading, login } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="protected-layout">
        <div className="loading-container">
          <Loader className="loading-spinner" size={48} />
          <p className="loading-text">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="protected-layout">
        <div className="login-prompt">
          <div className="login-content">
            <Shield className="login-icon" size={64} />
            <h2 className="login-title">Secure Access Required</h2>
            <p className="login-subtitle">Please sign in to access the financial dashboard</p>
            <button className="login-button" onClick={login}>
              <LogIn size={20} />
              Sign In with Cognito
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render protected content if authenticated
  return <div className="protected-layout">{children}</div>;
};

export default ProtectedLayout;