import React, { useState } from 'react';
import axios from 'axios';
import { DollarSign, CheckCircle, XCircle, Loader, User } from 'lucide-react';

const BalanceEntry = () => {
  const [formData, setFormData] = useState({
    name: '',
    balance: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'balance') {
      // Only allow numbers and decimal point for balance
      const numericValue = value.replace(/[^0-9.]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear any previous status when user starts typing
    if (status) setStatus(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setStatus({ type: 'error', message: 'Please enter a name' });
      return false;
    }

    if (!formData.balance || parseFloat(formData.balance) < 0) {
      setStatus({ type: 'error', message: 'Please enter a valid balance amount' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setStatus(null);

    try {
      const payload = {
        name: formData.name.trim(),
        balance: parseFloat(formData.balance)
      };

      const response = await axios.post('https://n8n.manifestingpodcasts.site/webhook/name,balance', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setStatus({
        type: 'success',
        message: `Balance entry for "${formData.name}" saved successfully!`
      });

      // Clear form on success
      setFormData({ name: '', balance: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to save balance entry. Please try again.'
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
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter account holder name"
                className="form-input"
                disabled={submitting}
                required
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
            disabled={submitting || !formData.name.trim() || !formData.balance}
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
