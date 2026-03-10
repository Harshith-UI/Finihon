import React, { useState } from 'react';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedLayout from './components/ProtectedLayout';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BankStatementUpload from './components/BankStatementUpload';
import InvoiceUpload from './components/InvoiceUpload';
import BalanceEntry from './components/BalanceEntry';
import AIAnalysis from './components/AIAnalysis';
import SpendingChart from './components/SpendingChart';

function App() {
  const [analysisData, setAnalysisData] = useState(null);

  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
  };

  return (
    <AuthProvider>
      <ProtectedLayout>
        <div className="app-layout">
          <Sidebar />
          <div className="main-wrapper">
            <Header />
            <main className="dashboard-content">
              <div className="grid-top">
                <BankStatementUpload onAnalysisComplete={handleAnalysisComplete} />
                <BalanceEntry />
              </div>
              <div className="grid-bottom">
                <AIAnalysis report={analysisData?.report} />
                <SpendingChart categoryTotals={analysisData?.categoryTotals} />
                <InvoiceUpload />
              </div>
            </main>
          </div>
        </div>
      </ProtectedLayout>
    </AuthProvider>
  );
}

export default App;
