import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, CreditCard, FileText, DollarSign } from 'lucide-react';
import InvoiceUpload from './InvoiceUpload';
import BankStatementUpload from './BankStatementUpload';
import BalanceEntry from './BalanceEntry';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">Financial Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, {user?.username}!</p>
        </div>
        <div className="header-right">
          <div className="user-info">
            <User size={20} />
            <span>{user?.username}</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-grid">
          <InvoiceUpload />
          <BankStatementUpload />
          <BalanceEntry />
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>Powered by MongoDB & React • Your financial data is secure with us</p>
      </footer>
    </div>
  );
};

export default Dashboard;