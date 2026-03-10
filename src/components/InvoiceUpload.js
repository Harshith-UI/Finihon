import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Upload, FileText, CheckCircle, XCircle, Loader, Plus } from 'lucide-react';

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

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
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
      await axios.post(
        'https://n8n.manifestingpodcasts.site/webhook/upload-pdf',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setStatus({ type: 'success', message: 'Invoice uploaded and processing started!' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to upload invoice. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dashboard-card invoice-card">
      <div className="card-top-bar">
        <h3>Invoices</h3>
        <button className="icon-btn" title="Upload Invoice">
          <Plus size={16} />
        </button>
      </div>
      <div className="card-body">
        <div
          className={`upload-zone compact ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="file-info">
              <FileText size={18} className="file-icon-green" />
              <div className="file-details">
                <p className="file-name">{file.name}</p>
                <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button className="remove-btn" onClick={() => setFile(null)} disabled={uploading}>
                <XCircle size={14} />
              </button>
            </div>
          ) : (
            <>
              <Upload size={28} className="upload-icon-dim" />
              <p className="upload-text">
                Drop PDF invoice or{' '}
                <label className="browse-label">
                  browse
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                </label>
              </p>
              <p className="upload-hint">PDF files only</p>
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
            <><Loader className="spin" size={15} /> Processing...</>
          ) : (
            <><Upload size={15} /> Upload & Process Invoice</>
          )}
        </button>
      </div>
    </div>
  );
};

export default InvoiceUpload;
