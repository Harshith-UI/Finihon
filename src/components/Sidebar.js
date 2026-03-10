import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Upload, FileText, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#3b82f6" />
        </svg>
      </div>
      <nav className="sidebar-nav">
        <button className="sidebar-btn active" title="Dashboard">
          <LayoutDashboard size={20} />
        </button>
        <button className="sidebar-btn" title="Uploads">
          <Upload size={20} />
        </button>
        <button className="sidebar-btn" title="Documents">
          <FileText size={20} />
        </button>
        <button className="sidebar-btn" title="Settings">
          <Settings size={20} />
        </button>
      </nav>
      <div className="sidebar-bottom">
        <button className="sidebar-btn" onClick={logout} title="Sign Out">
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
