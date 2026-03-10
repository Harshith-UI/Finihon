import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Upload, FileText, CheckCircle, XCircle, Loader, CreditCard } from 'lucide-react';

const BankStatementUpload = ({ onAnalysisComplete }) => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    const allowedTypes = [
      'application/pdf', 'text/plain', 'text/csv',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setStatus(null);
    } else {
      setStatus({ type: 'error', message: 'Please select a PDF, TXT, DOC, DOCX, or CSV file' });
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const parseResponse = (data) => {
    let report = null;
    let categoryTotals = null;
    if (!data) return { report, categoryTotals };
    if (typeof data === 'string') return { report: data, categoryTotals };
    if (Array.isArray(data)) return parseResponse(data[0]);

    const reportFields = ['report', 'text', 'output', 'response', 'message', 'content', 'analysis'];
    for (const f of reportFields) {
      if (data[f] && typeof data[f] === 'string') { report = data[f]; break; }
    }

    const catFields = ['categoryTotals', 'categories', 'spending', 'totals', 'categoryBreakdown'];
    for (const f of catFields) {
      if (data[f] && typeof data[f] === 'object') {
        if (Array.isArray(data[f])) {
          categoryTotals = {};
          data[f].forEach(item => {
            const name = item.name || item.category || item.label;
            const value = item.total || item.value || item.amount;
            if (name && value !== undefined) categoryTotals[name] = Number(value);
          });
        } else {
          categoryTotals = data[f];
        }
        break;
      }
    }

    if (!report) {
      for (const key of Object.keys(data)) {
        if (typeof data[key] === 'string' && data[key].length > 50) { report = data[key]; break; }
      }
    }
    return { report, categoryTotals };
  };

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('action', 'bank_statement');
    formData.append('userId', user?.name || 'Unknown');

    try {
      const response = await axios.post(
        'https://n8n.manifestingpodcasts.site/webhook/upload-passbook',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      const parsed = parseResponse(response.data);
      if (onAnalysisComplete) onAnalysisComplete(parsed);
      setStatus({ type: 'success', message: 'Statement processed successfully!' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to process statement. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dashboard-card statement-card">
      <div className="card-top-bar">
        <div className="card-top-left">
          <CreditCard size={18} className="card-icon-accent" />
          <h3>Bank Statement Processing</h3>
        </div>
      </div>
      <div className="card-body">
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="file-info">
              <FileText size={20} className="file-icon-green" />
              <div className="file-details">
                <p className="file-name">{file.name}</p>
                <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button className="remove-btn" onClick={() => setFile(null)} disabled={uploading}>
                <XCircle size={16} />
              </button>
            </div>
          ) : (
            <>
              <Upload size={36} className="upload-icon-dim" />
              <p className="upload-text">
                Drag & drop your bank statement here, or{' '}
                <label className="browse-label">
                  browse files
                  <input
                    type="file"
                    accept=".pdf,.txt,.doc,.docx,.csv"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                </label>
              </p>
              <p className="upload-hint">Supports PDF, TXT, DOC, DOCX, CSV</p>
            </>
          )}
        </div>

        {status && (
          <div className={`status-msg ${status.type}`}>
            {status.type === 'success' ? <CheckCircle size={15} /> : <XCircle size={15} />}
            <span>{status.message}</span>
          </div>
        )}

        <button className="action-btn" onClick={handleSubmit} disabled={!file || uploading}>
          {uploading ? (
            <><Loader className="spin" size={16} /> Analyzing Statement...</>
          ) : (
            <><Upload size={16} /> Process Statement & Analyze</>
          )}
        </button>
      </div>
    </div>
  );
};

export default BankStatementUpload;
