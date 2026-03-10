import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Maximize2, TrendingUp, CheckCircle } from 'lucide-react';

const AIAnalysis = ({ report }) => {
  return (
    <div className="dashboard-card ai-card">
      <div className="card-top-bar">
        <div className="card-top-left">
          <Sparkles size={16} className="sparkle-icon" />
          <h3>How can I help you?</h3>
        </div>
        <Maximize2 size={14} className="expand-icon" />
      </div>
      <div className="card-body">
        <div className="ai-label-row">
          <span className="ai-label">AI Summary</span>
        </div>
        {report ? (
          <div className="ai-report-content">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        ) : (
          <p className="ai-placeholder">
            Upload a bank statement to get AI-powered financial insights and analysis.
          </p>
        )}
        <div className="ai-stats-row">
          <div className="ai-stat">
            <span className="ai-stat-name">Spending Trends</span>
            <div className="ai-stat-val">
              <TrendingUp size={15} />
              <span>{report ? 'Analyzed' : '--'}</span>
              {report && <span className="stat-badge green">Stable</span>}
            </div>
          </div>
          <div className="ai-stat">
            <span className="ai-stat-name">Transactions</span>
            <div className="ai-stat-val">
              <CheckCircle size={15} />
              <span>{report ? 'Processed' : '--'}</span>
              {report && <span className="stat-badge blue">Complete</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;
