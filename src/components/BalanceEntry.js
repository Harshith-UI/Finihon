import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { DollarSign, CheckCircle, XCircle, Loader, User } from 'lucide-react';

const BalanceEntry = () => {
  const [formData, setFormData] = useState({
    balance: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const { user } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'balance') {
      // Only allow numbers and decimal point for balance
      const numericValue = value.replace(/[^0-9.]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    }

    // Clear any previous status when user starts typing
    if (status) setStatus(null);
  };

  const validateForm = () => {
    if (!formData.balance || parseFloat(formData.balance) < 0) {
      setStatus({ type: 'error', message: 'Please enter a valid balance amount' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setStatus({ type: 'error', message: 'Please log in to add balance entries' });
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);
    setStatus(null);

    try {
      // First, try to save to our new backend API
      await axios.post('https://financial-dashboard-backend.onrender.com/api/financial/add-balance', {
        balanceAmount: parseFloat(formData.balance)
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      // Then send to n8n for processing
      const n8nPayload = {
        name: user.username,
        balance: parseFloat(formData.balance)
      };

      await axios.post('https://n8n.manifestingpodcasts.site/webhook/name,balance', n8nPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setStatus({
        type: 'success',
        message: `Balance entry for "${user.username}" saved successfully!`
      });

      // Clear form on success
      setFormData({ balance: '' });
    } catch (error) {
      console.error('Save error:', error);
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to save balance entry. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <User className="card-icon" />
        <h3 className="card-title">Manual Balance Entry</h3>
      </div>

      <div className="card-content">
        <form onSubmit={handleSubmit} className="balance-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Account Holder Name
            </label>
            <div className="input-group">
              <User size={16} className="input-icon" />
              <input
                type="text"
                id="name"
                name="name"
                value={user?.username || ''}
                readOnly
                className="form-input"
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="balance" className="form-label">
              Current Balance
            </label>
            <div className="input-group">
              <DollarSign size={16} className="input-icon" />
              <input
                type="text"
                id="balance"
                name="balance"
                value={formData.balance}
                onChange={handleInputChange}
                placeholder="0.00"
                className="form-input"
                disabled={submitting}
                required
              />
            </div>
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
            type="submit"
            className="submit-button"
            disabled={submitting || !formData.balance}
          >
            {submitting ? (
              <>
                <Loader className="loading-spinner" size={16} />
                Saving...
              </>
            ) : (
              <>
                <DollarSign size={16} />
                Save Balance Entry
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BalanceEntry;
