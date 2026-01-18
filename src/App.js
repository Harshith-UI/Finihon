import React from 'react';
import './App.css';
import InvoiceUpload from './components/InvoiceUpload';
import BankStatementUpload from './components/BankStatementUpload';
import BalanceEntry from './components/BalanceEntry';

function App() {
  return (
    <div className="App">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Financial Data Processor</h1>
          <p className="dashboard-subtitle">Automate your financial document processing</p>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          <InvoiceUpload />
          <BankStatementUpload />
          <BalanceEntry />
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>Powered by n8n & React • Financial data processing made simple</p>
      </footer>
    </div>
  );
}

export default App;
