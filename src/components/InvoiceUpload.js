import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Upload, FileText, CheckCircle, XCircle, Loader } from 'lucide-react';

const InvoiceUpload = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setStatus(null);
    } else {
      setStatus({ type: 'error', message: 'Please select a PDF file only' });
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

    setUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('action', 'invoice_upload');
    formData.append('userId', user?.name || 'Unknown');

    try {
      const response = await axios.post('https://n8n.manifestingpodcasts.site/webhook/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setStatus({
        type: 'success',
        message: 'Invoice uploaded and processing started successfully!'
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to upload invoice. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <FileText className="card-icon" />
        <h3 className="card-title">Invoice Upload</h3>
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
                Drag & drop your PDF invoice here, or{' '}
                <label className="file-input-label">
                  browse files
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                </label>
              </p>
              <p className="upload-hint">Only PDF files are supported</p>
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
              Processing...
            </>
          ) : (
            <>
              <Upload size={16} />
              Upload & Process Invoice
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InvoiceUpload;
