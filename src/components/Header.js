import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Search, User, ChevronDown } from 'lucide-react';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="top-header">
      <h1 className="page-title">Overview</h1>
      <div className="header-right">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <div className="header-profile">
          <div className="profile-avatar">
            <User size={16} />
          </div>
          <div className="profile-info">
            <span className="profile-name">{user?.name || 'User'}</span>
            <span className="profile-email">{user?.email || ''}</span>
          </div>
          <ChevronDown size={14} className="profile-chevron" />
        </div>
      </div>
    </header>
  );
};

export default Header;
