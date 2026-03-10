import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';
import { Upload, FileText, CheckCircle, XCircle, Loader, CreditCard, X, Bot } from 'lucide-react';

const BankStatementUpload = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      // Accept various file types for bank statements
      const allowedTypes = [
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/csv'
      ];

      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setStatus(null);
        setAiResponse(null);
      } else {
        setStatus({
          type: 'error',
          message: 'Please select a PDF, TXT, DOC, DOCX, or CSV file'
        });
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  // Extract the AI response text from various possible n8n response formats
  const extractResponseText = (data) => {
    if (!data) return null;

    // If it's a string already, return it
    if (typeof data === 'string') return data;

    // If it's an array, take the first item
    if (Array.isArray(data)) {
      if (data.length === 0) return null;
      return extractResponseText(data[0]);
    }

    // Common n8n output field names from "Message a model" / AI nodes
    const possibleFields = [
      'output', 'text', 'response', 'message', 'content',
      'result', 'data', 'answer', 'completion'
    ];

    for (const field of possibleFields) {
      if (data[field] !== undefined && data[field] !== null) {
        if (typeof data[field] === 'string') return data[field];
        if (typeof data[field] === 'object') return extractResponseText(data[field]);
      }
    }

    // If nothing matched, try to stringify the whole thing
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setUploading(true);
    setStatus(null);
    setAiResponse(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('action', 'bank_statement');
    formData.append('userId', user?.name || 'Unknown');

    try {
      const response = await axios.post('https://n8n.manifestingpodcasts.site/webhook/upload-passbook', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Extract the AI model response
      const responseText = extractResponseText(response.data);
      setAiResponse(responseText);

      setStatus({
        type: 'success',
        message: 'Bank statement processed successfully!'
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to upload bank statement. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <CreditCard className="card-icon" />
        <h3 className="card-title">Bank Statement Processing</h3>
      </div>

      <div className="card-content">
        <div
          className={`upload-area ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="file-info">
              <FileText className="file-icon" />
              <div className="file-details">
                <p className="file-name">{file.name}</p>
                <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                className="remove-file"
                onClick={() => { setFile(null); setAiResponse(null); }}
                disabled={uploading}
              >
                <XCircle size={16} />
              </button>
            </div>
          ) : (
            <>
              <Upload className="upload-icon" />
              <p className="upload-text">
                Drag & drop your bank statement here, or{' '}
                <label className="file-input-label">
                  browse files
                  <input
                    type="file"
                    accept=".pdf,.txt,.doc,.docx,.csv"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                </label>
              </p>
              <p className="upload-hint">Supports PDF, TXT, DOC, DOCX, CSV files</p>
            </>
          )}
        </div>

        {status && (
          <div className={`status-message ${status.type}`}>
            {status.type === 'success' ? (
              <CheckCircle size={16} />
            ) : (
              <XCircle size={16} />
            )}
            <span>{status.message}</span>
          </div>
        )}

        {/* AI Model Response Display */}
        {aiResponse && (
          <div className="ai-response-container">
            <div className="ai-response-header">
              <Bot size={18} />
              <span>AI Analysis</span>
              <button
                className="ai-response-close"
                onClick={() => setAiResponse(null)}
                title="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
            <div className="ai-response-body">
              <ReactMarkdown>{aiResponse}</ReactMarkdown>
            </div>
          </div>
        )}

        <button
          className="upload-button"
          onClick={handleSubmit}
          disabled={!file || uploading}
        >
          {uploading ? (
            <>
              <Loader className="loading-spinner" size={16} />
              Analyzing Statement...
            </>
          ) : (
            <>
              <Upload size={16} />
              Process Statement & Analyze
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BankStatementUpload;
