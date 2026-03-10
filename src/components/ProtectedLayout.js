import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader, LogIn, Shield } from 'lucide-react';

const ProtectedLayout = ({ children }) => {
  const { isAuthenticated, loading, login } = useAuth();

  if (loading) {
    return (
      <div className="auth-screen">
        <div className="auth-loader">
          <Loader className="spin" size={48} />
          <p>Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-screen">
        <div className="auth-box">
          <Shield size={56} className="auth-shield" />
          <h2>Secure Access Required</h2>
          <p>Please sign in to access the financial dashboard</p>
          <button className="auth-login-btn" onClick={login}>
            <LogIn size={20} />
            Sign In with Cognito
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedLayout;