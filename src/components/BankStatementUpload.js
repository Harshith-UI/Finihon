import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Upload, FileText, CheckCircle, XCircle, Loader, CreditCard } from 'lucide-react';

const BankStatementUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const { user } = useAuth();

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

  const handleSubmit = async () => {
    if (!file) return;
    if (!user) {
      setStatus({ type: 'error', message: 'Please log in to upload bank statements' });
      return;
    }

    setUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.id);
    formData.append('username', user.username);

    try {
      // First, try to upload to our new backend API
      const response = await axios.post('https://financial-dashboard-backend.onrender.com/api/financial/upload-statement', {
        userId: user.id,
        username: user.username,
        fileName: file.name
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      // Then upload to n8n for processing
      const n8nFormData = new FormData();
      n8nFormData.append('file', file);
      n8nFormData.append('userId', user.id);
      n8nFormData.append('username', user.username);

      await axios.post('https://n8n.manifestingpodcasts.site/webhook/upload-passbook', n8nFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setStatus({
        type: 'success',
        message: 'Bank statement uploaded and balance calculation started!'
      });
    } catch (error) {
      console.error('Upload error:', error);
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to upload bank statement. Please try again.'
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
                onClick={() => setFile(null)}
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

        <button
          className="upload-button"
          onClick={handleSubmit}
          disabled={!file || uploading}
        >
          {uploading ? (
            <>
              <Loader className="loading-spinner" size={16} />
              Calculating Balance...
            </>
          ) : (
            <>
              <Upload size={16} />
              Process Statement & Update Balance
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BankStatementUpload;
